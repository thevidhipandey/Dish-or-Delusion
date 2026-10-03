import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ChevronLeft, RotateCcw, Salad, Sparkles, Utensils } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DISHES, shuffleDishes, type Dish, type DishAnswer } from "@/lib/dishes";
import dishContactSheet from "@/assets/dish-contact-sheet.jpg";

type Screen = "landing" | "play" | "reveal" | "results" | "review";
type AnswerRecord = { dish: Dish; guess: DishAnswer; correct: boolean };
type ScoreFeedback = "correct" | "wrong" | null;

const TOTAL_ROUNDS = 10;

const accentClasses: Record<Dish["color"], string> = {
  tomato: "bg-primary text-primary-foreground",
  mustard: "bg-accent text-accent-foreground",
  sage: "bg-chart-2 text-foreground",
  plum: "bg-chart-5 text-primary-foreground",
  ocean: "bg-chart-3 text-primary-foreground",
};

const imagePositions: Record<number, string> = {
  1: "0% 0%", 2: "25% 0%", 3: "50% 0%", 4: "75% 0%", 5: "100% 0%",
  6: "0% 100%", 7: "25% 100%", 8: "50% 100%", 9: "75% 100%", 10: "100% 100%",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dish or Delusion — A suspiciously tasty guessing game" },
      { name: "description", content: "Swipe through bizarre dishes and decide whether they are real or deliciously made up." },
      { property: "og:title", content: "Dish or Delusion — A suspiciously tasty guessing game" },
      { property: "og:description", content: "Some of these are real. Unfortunately." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DishOrDelusion,
});

function DishOrDelusion() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [round, setRound] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [busy, setBusy] = useState(false);
  const [handoff, setHandoff] = useState(false);
  const [scoreFeedback, setScoreFeedback] = useState<ScoreFeedback>(null);
  const dragStart = useRef(0);

  const currentDish = dishes[round];
  const correctCount = answers.filter((answer) => answer.correct).length;
  const currentAnswer = answers[round];
  const reviewAnswer = answers[reviewIndex];

  const resultMessage = useMemo(() => {
    if (correctCount === 10) return "Your food knowledge is suspiciously powerful.";
    if (correctCount >= 8) return "You have clearly spent too much time thinking about food.";
    if (correctCount >= 5) return "Honestly? Respectable.";
    if (correctCount >= 3) return "Your culinary instincts need supervision.";
    return "You have been successfully deceived by lunch.";
  }, [correctCount]);

  useEffect(() => {
    if (screen !== "play") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (busy) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        submitAnswer("fake");
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        submitAnswer("real");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [screen, busy, currentDish]);

  function startGame() {
    setDishes(shuffleDishes(DISHES));
    setRound(0);
    setAnswers([]);
    setReviewIndex(0);
    setDragX(0);
    setBusy(false);
    setHandoff(false);
    setScoreFeedback(null);
    setScreen("play");
  }

  function submitAnswer(guess: DishAnswer) {
    if (!currentDish || busy) return;
    setBusy(true);
    setDragX(guess === "real" ? 720 : -720);

    window.setTimeout(() => {
      const nextAnswer = {
        dish: currentDish,
        guess,
        correct: currentDish.answer === guess,
      };
      setAnswers((previous) => [...previous, nextAnswer]);
      setScoreFeedback(nextAnswer.correct ? "correct" : "wrong");
      setHandoff(true);
      window.setTimeout(() => {
        setDragX(0);
        setHandoff(false);
        setScreen("reveal");
        setBusy(false);
      }, 180);
    }, 280);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (busy || screen !== "play") return;
    dragStart.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (busy || screen !== "play" || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    setDragX(event.clientX - dragStart.current);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (busy || screen !== "play") return;
    const distance = event.clientX - dragStart.current;
    if (Math.abs(distance) > 92) {
      submitAnswer(distance > 0 ? "real" : "fake");
    } else {
      setDragX(0);
    }
  }

  function nextDish() {
    if (round === TOTAL_ROUNDS - 1) {
      setScreen("results");
      return;
    }
    setRound((previous) => previous + 1);
    setScreen("play");
  }

  return (
    <main className="dish-app">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-8 sm:px-8">
        <Header screen={screen} onHome={() => setScreen("landing")} />
        {screen === "landing" && <LandingScreen onStart={startGame} />}
        {screen === "play" && currentDish && (
          <GameScreen
            dish={currentDish}
            round={round}
            score={correctCount}
            scoreFeedback={scoreFeedback}
            dragX={dragX}
            busy={busy}
            handoff={handoff}
            previewDish={dishes[round + 1]}
            onAnswer={submitAnswer}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          />
        )}
        {screen === "reveal" && currentAnswer && (
          <RevealScreen answer={currentAnswer} round={round} score={correctCount} onNext={nextDish} />
        )}
        {screen === "results" && (
          <ResultsScreen score={correctCount} message={resultMessage} onAgain={startGame} onReview={() => {
            setReviewIndex(0);
            setScreen("review");
          }} />
        )}
        {screen === "review" && reviewAnswer && (
          <ReviewScreen
            answer={reviewAnswer}
            index={reviewIndex}
            total={answers.length}
            onBack={() => setScreen("results")}
            onPrevious={() => setReviewIndex((previous) => Math.max(0, previous - 1))}
            onNext={() => setReviewIndex((previous) => Math.min(answers.length - 1, previous + 1))}
          />
        )}
      </div>
    </main>
  );
}

function Header({ screen, onHome }: { screen: Screen; onHome: () => void }) {
  return (
    <header className="zine-header flex items-center justify-between py-4 sm:py-5">
      <Button type="button" variant="ghost" onClick={onHome} className="group h-auto gap-3 p-0 text-left hover:bg-transparent" aria-label="Return to home">
        <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:rotate-12">
          <Utensils className="size-4" />
        </span>
        <span className="display-font text-xl leading-none">dish / delusion</span>
      </Button>
      {screen !== "landing" && screen !== "results" && screen !== "review" && (
        <span className="micro-label hidden sm:inline">trust your gut. literally.</span>
      )}
      {screen === "landing" && <span className="micro-label">vol. 01 · kitchen mysteries</span>}
    </header>
  );
}

function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="landing-stage flex flex-1 items-center py-8 sm:py-14">
      <div className="grid w-full items-center gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="float-in relative z-10 py-6">
          <p className="micro-label mb-5 text-primary">the culinary guessing game · swipe responsibly</p>
          <h1 className="display-font brand-title max-w-5xl text-[clamp(4.3rem,11vw,10rem)] leading-[0.75] text-foreground">
            Dish <span className="zine-highlight">or</span><br /> Delusion
          </h1>
          <p className="mt-8 max-w-xl text-xl font-bold leading-tight text-foreground sm:text-3xl">
            Some of these are real. Unfortunately.
          </p>
          <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
            Swipe right if you think it&apos;s a real dish. Swipe left if you think someone made it up.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Button type="button" onClick={onStart} className="ink-button h-14 -rotate-1 rounded-none border-2 border-foreground bg-primary px-8 text-base font-black uppercase text-primary-foreground hover:bg-primary">
              Start tasting <ArrowRight className="size-5" />
            </Button>
            <span className="max-w-44 text-xs font-bold leading-5 text-muted-foreground">Your culinary judgment will be questioned.</span>
          </div>
          <span className="landing-note landing-note-left">← LIE</span>
          <span className="landing-note landing-note-right">REAL →</span>
        </div>
        <div className="landing-collage relative mx-auto w-full max-w-lg" aria-hidden="true">
          <div className="collage-label collage-label-one">100% EDIBLE-ISH</div>
          <div className="collage-label collage-label-two">TRUST YOUR GUT.</div>
          <div className="collage-photo collage-photo-main">
            <DishImage dish={DISHES[2]} eager />
            <span>QUESTIONABLE CUISINE AHEAD</span>
          </div>
          <div className="collage-photo collage-photo-small">
            <DishImage dish={DISHES[7]} eager />
          </div>
          <div className="sticker sticker-one">HOT<br />TAKE</div>
          <div className="sticker sticker-two"><Salad className="size-10" /></div>
          <div className="sauce-splat" />
          <div className="absolute bottom-1 right-4 -rotate-6 bg-accent px-3 py-2 text-xs font-black uppercase">real food. fake confidence.</div>
            </div>
      </div>
    </section>
  );
}

function GameScreen({
  dish,
  round,
  score,
  scoreFeedback,
  dragX,
  busy,
  handoff,
  previewDish,
  onAnswer,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  dish: Dish;
  round: number;
  score: number;
  scoreFeedback: ScoreFeedback;
  dragX: number;
  busy: boolean;
  handoff: boolean;
  previewDish: Dish | undefined;
  onAnswer: (guess: DishAnswer) => void;
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void;
}) {
  const tilt = Math.max(-12, Math.min(12, dragX / 18));
  const swipeLabel = dragX > 20 ? "real dish" : dragX < -20 ? "delusion" : "";

  return (
    <section className="flex flex-1 flex-col items-center py-5 sm:py-8">
      <div className="mb-5 flex w-full max-w-4xl items-end justify-between">
        <div>
          <p className="micro-label text-primary">round {String(round + 1).padStart(2, "0")} / 10</p>
          <h1 className="display-font mt-1 text-3xl sm:text-5xl">What&apos;s the verdict?</h1>
        </div>
        <div className="text-right">
          <p className="micro-label text-muted-foreground">score</p>
          <p className={`score-counter display-font text-3xl ${scoreFeedback === "correct" ? "score-pop" : scoreFeedback === "wrong" ? "score-shake" : ""}`}>
            {score} / {round}
          </p>
        </div>
      </div>
      <div className="mb-5 flex h-2 w-full max-w-4xl gap-1" aria-label={`Round ${round + 1} of ${TOTAL_ROUNDS}`}>
        {Array.from({ length: TOTAL_ROUNDS }, (_, index) => <span key={index} className={`h-full flex-1 transition-colors ${index <= round ? "bg-primary" : "bg-secondary"}`} />)}
      </div>
      <div
        className={`relative w-full max-w-4xl touch-pan-y select-none ${busy ? "cursor-default" : "cursor-grab active:cursor-grabbing"}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="application"
        aria-label="Swipe dish card left for delusion or right for real dish"
      >
        <div className={`preview-card pointer-events-none absolute inset-x-3 top-2 z-0 h-full overflow-hidden border-2 border-foreground bg-accent transition-all duration-200 ease-out ${handoff ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[0.97] opacity-75"}`} aria-hidden="true">
          {previewDish ? (
            <div className={`flex h-full flex-col justify-between p-6 opacity-70 sm:p-8 ${accentClasses[previewDish.color]}`}>
              <div className="micro-label flex items-start justify-between">
                <span>next dish</span>
                <Sparkles className="size-4" />
              </div>
              <span className="micro-label">case file / ???</span>
            </div>
          ) : <div className="h-full bg-secondary/60" />}
        </div>
        <div
          className="game-card relative z-10 min-h-[34rem] overflow-hidden border-2 border-foreground bg-card p-3 dish-card-shadow transition-transform duration-200 ease-out sm:min-h-[31rem] sm:p-5"
          style={{ transform: `translateX(${dragX}px) rotate(${tilt}deg)`, transitionDuration: busy ? "280ms" : dragX === 0 ? "220ms" : "0ms" }}
        >
          {swipeLabel && <span className={`swipe-stamp absolute top-8 z-30 border-4 px-5 py-3 text-xl font-black uppercase ${dragX > 0 ? "right-8 border-chart-2 text-chart-2" : "left-8 border-chart-5 text-chart-5"}`} style={{ opacity: Math.min(1, Math.abs(dragX) / 110) }}>{swipeLabel}</span>}
          <div className="grid h-full gap-4 sm:grid-cols-[0.9fr_1.1fr] sm:gap-6">
            <div className="relative min-h-56 overflow-hidden bg-secondary sm:min-h-full">
              <DishImage dish={dish} eager />
              <span className={`absolute bottom-3 left-3 z-10 -rotate-2 px-3 py-2 text-xs font-black uppercase ${accentClasses[dish.color]}`}>{dish.origin}</span>
            </div>
            <div className="flex flex-col justify-between p-3 sm:p-5">
              <div>
                <div className="micro-label flex items-start justify-between gap-4 text-muted-foreground"><span>case file / {String(dish.id).padStart(3, "0")}</span><Sparkles className="size-4" /></div>
                <h2 className="display-font mt-5 text-5xl leading-[0.85] sm:text-7xl">{dish.name}</h2>
                <p className="mt-6 max-w-lg text-base font-semibold leading-7 text-muted-foreground sm:text-lg">{dish.description}</p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t-2 border-foreground pt-4 text-xs font-black uppercase">
                <span>slide to decide</span><span className="bg-accent px-2 py-1">{dish.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex w-full max-w-4xl items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={() => onAnswer("fake")} disabled={busy} className="choice-button h-14 flex-1 rounded-none border-2 border-chart-5 bg-background text-xs font-black uppercase text-chart-5 hover:bg-chart-5 hover:text-primary-foreground sm:px-8">
          <ArrowLeft className="size-4" /> Delusion
        </Button>
        <span className="micro-label hidden text-muted-foreground sm:block">or use ← / →</span>
        <Button type="button" onClick={() => onAnswer("real")} disabled={busy} className="choice-button h-14 flex-1 rounded-none border-2 border-primary bg-primary text-xs font-black uppercase text-primary-foreground hover:bg-primary/90 sm:px-8">
          Real dish <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}

function RevealScreen({ answer, round, score, onNext }: { answer: AnswerRecord; round: number; score: number; onNext: () => void }) {
  const isReal = answer.dish.answer === "real";
  return (
    <section className="flex flex-1 items-center justify-center py-8 sm:py-12">
      <div className="reveal-stage float-in w-full max-w-4xl">
        <div className="micro-label mb-5 flex items-center justify-between text-muted-foreground">
          <span>the reveal · {String(round + 1).padStart(2, "0")} / {TOTAL_ROUNDS}</span>
          <span className={`score-feedback ${answer.correct ? "text-chart-2" : "text-primary"}`}>
            <span className="mr-3 hidden sm:inline">score {score} / {round + 1}</span>{answer.correct ? "you nailed it" : "plot twist"}
          </span>
        </div>
        <div className={`relative border-2 border-foreground bg-card p-5 dish-card-shadow sm:p-8 ${answer.correct ? "reveal-correct" : "reveal-wrong"}`}>
          {answer.correct && <ConfettiBurst />}
          <div className="reveal-verdict flex flex-wrap items-center gap-4">
            <span className={`swipe-stamp -rotate-3 border-4 px-5 py-2 text-xl font-black uppercase ${answer.correct ? "border-chart-2 text-chart-2" : "border-primary text-primary"}`}>
              {answer.correct ? "okay chef" : "you got fooled"}
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.17em] text-muted-foreground">{answer.dish.name}</span>
          </div>
          <div className="reveal-body">
            <h1 className="display-font mt-8 text-6xl leading-[0.85] sm:text-8xl">{answer.correct ? "You were right." : isReal ? "It was real." : "Culinary delusion."}</h1>
            {!answer.correct && <p className="mt-4 text-sm font-black text-chart-5">bro really believed that 💀</p>}
            <div className="editorial-rule my-9" />
            <p className="micro-label text-primary">the story</p>
            <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">{answer.dish.reveal}</p>
            {!isReal && answer.dish.fakeExplanation && <p className="mt-5 border-l-2 border-accent pl-4 text-sm italic leading-6 text-muted-foreground">P.S. {answer.dish.fakeExplanation}</p>}
            <div className="mt-10 grid grid-cols-3 gap-3 border-t border-border pt-6">
              <Info label="origin" value={answer.dish.origin} />
              <Info label="category" value={answer.dish.category} />
              <Info label="verdict" value={isReal ? "real" : "fake"} />
            </div>
          </div>
        </div>
        <Button type="button" onClick={onNext} className="ink-button mt-6 h-14 w-full rounded-none border-2 border-foreground bg-primary text-xs font-black uppercase text-primary-foreground hover:bg-primary">
          {round === TOTAL_ROUNDS - 1 ? "See my verdict" : "Next victim"} <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}

function ConfettiBurst() {
  return (
    <div className="confetti-burst" aria-hidden="true">
      {Array.from({ length: 12 }, (_, index) => <span key={index} className={`confetti-particle confetti-${index + 1}`} />)}
    </div>
  );
}

function ResultsScreen({ score, message, onAgain, onReview }: { score: number; message: string; onAgain: () => void; onReview: () => void }) {
  const title = score >= 8 ? "Suspiciously knowledgeable" : score >= 5 ? "Culinary menace" : "Easily fooled";
  return (
    <section className="flex flex-1 items-center justify-center py-14">
      <div className="float-in w-full max-w-3xl text-center">
        <p className="micro-label text-primary">your verdict</p>
        <div className="result-card relative mx-auto my-7 max-w-2xl border-2 border-foreground bg-card p-7 dish-card-shadow sm:p-10">
          <span className="absolute -right-3 -top-4 rotate-3 bg-accent px-4 py-2 text-xs font-black uppercase">screenshot this</span>
          <h1 className="display-font text-[clamp(6rem,20vw,11rem)] leading-[0.75] text-foreground">{score}<span className="text-primary">/</span>10</h1>
          <p className="mt-7 text-sm font-black uppercase text-chart-5">{title}</p>
          <div className="mx-auto mb-6 flex max-w-xs justify-center gap-1.5" aria-label={`${score} out of 10 correct`}>
            {Array.from({ length: 10 }, (_, index) => <span key={index} className={`mt-7 h-3 flex-1 ${index < score ? "bg-primary" : "bg-secondary"}`} />)}
          </div>
          <p className="text-xl font-bold leading-tight sm:text-2xl">“{message}”</p>
        </div>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={onAgain} className="ink-button h-13 rounded-none border-2 border-foreground bg-primary px-8 text-xs font-black uppercase text-primary-foreground hover:bg-primary">Play again <RotateCcw className="size-4" /></Button>
          <Button type="button" variant="outline" onClick={onReview} className="h-13 rounded-none border-2 border-foreground bg-transparent px-8 text-xs font-black uppercase text-foreground hover:bg-foreground hover:text-background">Review dishes</Button>
        </div>
      </div>
    </section>
  );
}

function ReviewScreen({ answer, index, total, onBack, onPrevious, onNext }: { answer: AnswerRecord; index: number; total: number; onBack: () => void; onPrevious: () => void; onNext: () => void }) {
  const isReal = answer.dish.answer === "real";
  return (
    <section className="flex flex-1 justify-center py-10 sm:py-14">
      <div className="float-in w-full max-w-3xl">
        <Button type="button" variant="ghost" onClick={onBack} className="mb-8 h-auto p-0 text-xs font-black uppercase text-muted-foreground hover:bg-transparent hover:text-foreground"><ChevronLeft className="size-4" /> back to verdict</Button>
        <div className="mb-7 flex items-end justify-between">
          <div><p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">dish review</p><h1 className="display-font mt-2 text-4xl font-bold">The evidence locker</h1></div>
          <span className="font-mono text-xs uppercase tracking-[0.17em] text-muted-foreground">{String(index + 1).padStart(2, "0")} / {total}</span>
        </div>
        <div className="border-2 border-foreground bg-card p-5 dish-card-shadow sm:p-8">
          <div className="flex items-center justify-between"><span className={`stamp px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.17em] ${answer.correct ? "text-chart-2" : "text-primary"}`}>{answer.correct ? "correct" : "missed"}</span><span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">you said: {answer.guess === "real" ? "real" : "delusion"}</span></div>
          <div className="mt-8 grid gap-6 sm:grid-cols-[0.8fr_1.2fr]"><div className="relative min-h-64 overflow-hidden"><DishImage dish={answer.dish} /></div><div><h2 className="display-font text-5xl leading-none sm:text-7xl">{answer.dish.name}</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{answer.dish.description}</p>
          <div className="editorial-rule my-8" />
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">{isReal ? "the real story" : "the delusion report"}</p>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">{answer.dish.reveal}</p>
          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-6"><Info label="origin" value={answer.dish.origin} /><Info label="category" value={answer.dish.category} /><Info label="verdict" value={isReal ? "real" : "fake"} /></div></div></div>
        </div>
        <div className="mt-8 flex justify-between gap-3"><Button type="button" variant="outline" onClick={onPrevious} disabled={index === 0} className="h-12 rounded-full border-2 border-foreground px-5 font-mono text-xs uppercase tracking-[0.15em]"><ArrowLeft className="size-4" /> previous</Button><Button type="button" variant="outline" onClick={onNext} disabled={index === total - 1} className="h-12 rounded-full border-2 border-foreground px-5 font-mono text-xs uppercase tracking-[0.15em]">next <ArrowRight className="size-4" /></Button></div>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{label}</p><p className="mt-1 text-sm font-semibold leading-5 text-foreground">{value}</p></div>;
}

function DishImage({ dish, eager = false }: { dish: Dish; eager?: boolean }) {
  return <img src={dishContactSheet} alt={`${dish.name} editorial food photograph`} className="dish-photo h-full w-full object-cover" style={{ objectPosition: imagePositions[dish.id] }} loading={eager ? "eager" : "lazy"} width={1920} height={768} />;
}
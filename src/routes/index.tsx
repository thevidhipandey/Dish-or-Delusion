import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ChevronLeft, RotateCcw, Salad, Sparkles, Utensils } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DISHES, shuffleDishes, type Dish, type DishAnswer } from "@/lib/dishes";

type Screen = "landing" | "play" | "reveal" | "results" | "review";
type AnswerRecord = { dish: Dish; guess: DishAnswer; correct: boolean };
type ScoreFeedback = "correct" | "wrong" | null;

const TOTAL_ROUNDS = 10;

const accentClasses: Record<Dish["color"], string> = {
  tomato: "bg-primary/10 text-primary",
  mustard: "bg-accent text-accent-foreground",
  sage: "bg-secondary text-secondary-foreground",
  plum: "bg-chart-5/10 text-chart-5",
  ocean: "bg-chart-3/10 text-chart-3",
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
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 pb-8 sm:px-8">
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
    <header className="flex items-center justify-between border-b border-border/70 py-5">
      <button type="button" onClick={onHome} className="group flex items-center gap-3 text-left" aria-label="Return to home">
        <span className="grid size-9 place-items-center rounded-full bg-foreground text-background transition-transform group-hover:rotate-12">
          <Utensils className="size-4" />
        </span>
        <span className="display-font text-lg font-bold leading-none tracking-tight">dish / delusion</span>
      </button>
      {screen !== "landing" && screen !== "results" && screen !== "review" && (
        <span className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">a game of edible doubt</span>
      )}
      {screen === "landing" && <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">vol. 01 · kitchen mysteries</span>}
    </header>
  );
}

function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="flex flex-1 items-center py-14 sm:py-20">
      <div className="grid w-full items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-24">
        <div className="float-in">
          <p className="mb-8 flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.24em] text-primary">
            <span className="h-px w-10 bg-primary" /> the culinary guessing game
          </p>
          <h1 className="display-font max-w-3xl text-[clamp(4rem,10vw,8.8rem)] font-black leading-[0.83] text-foreground">
            Dish <span className="text-primary">or</span><br /> Delusion
          </h1>
          <p className="display-font mt-8 max-w-xl text-2xl italic leading-tight text-muted-foreground sm:text-3xl">
            Some of these are real. Unfortunately.
          </p>
          <p className="mt-7 max-w-md text-base leading-7 text-muted-foreground">
            Swipe right if you think it&apos;s a real dish. Swipe left if you think someone made it up.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-7">
            <Button type="button" onClick={onStart} className="ink-button h-14 rounded-full bg-primary px-8 text-base font-bold text-primary-foreground hover:bg-primary">
              Start tasting <ArrowRight className="size-5" />
            </Button>
            <span className="max-w-44 text-xs leading-5 text-muted-foreground">Your culinary knowledge is about to be questioned.</span>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md rotate-2 lg:rotate-3" aria-hidden="true">
          <div className="absolute -left-5 top-10 size-24 rounded-full border border-primary/30 sm:-left-10 sm:size-32" />
          <div className="absolute -right-4 bottom-6 h-28 w-20 rounded-full border border-accent sm:-right-8 sm:h-40 sm:w-28" />
          <div className="relative aspect-[0.78] overflow-hidden rounded-[2rem] border-2 border-foreground bg-secondary p-4 dish-card-shadow sm:p-6">
            <div className="flex h-full flex-col justify-between rounded-[1.35rem] border border-foreground/15 bg-card p-5 sm:p-7">
              <div className="flex items-start justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">case no. 001</span>
                <span className="stamp px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-primary">mystery</span>
              </div>
              <div className="my-10 text-center">
                <div className="mx-auto mb-7 grid size-40 place-items-center rounded-full bg-accent/60 text-7xl shadow-inner sm:size-52 sm:text-8xl"><Salad className="size-20 stroke-[1.25] sm:size-28" /></div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">is this a thing?</p>
                <h2 className="display-font mt-3 text-3xl font-bold sm:text-4xl">Chocolate Pickles</h2>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                <span>← delusion</span><span>real dish →</span>
              </div>
            </div>
          </div>
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
    <section className="flex flex-1 flex-col items-center py-8 sm:py-12">
      <div className="mb-8 flex w-full max-w-2xl items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">round {String(round + 1).padStart(2, "0")}</p>
          <h1 className="display-font mt-2 text-3xl font-bold sm:text-4xl">What&apos;s the verdict?</h1>
        </div>
        <div className="text-right">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">score</p>
          <p className={`score-counter display-font text-2xl font-bold ${scoreFeedback === "correct" ? "score-pop" : scoreFeedback === "wrong" ? "score-shake" : ""}`}>
            {score} / {round}
          </p>
        </div>
      </div>
      <div className="mb-5 h-1.5 w-full max-w-2xl overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${((round + 1) / TOTAL_ROUNDS) * 100}%` }} />
      </div>
      <div
        className={`relative w-full max-w-2xl touch-pan-y select-none ${busy ? "cursor-default" : "cursor-grab active:cursor-grabbing"}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="application"
        aria-label="Swipe dish card left for delusion or right for real dish"
      >
        <div className={`pointer-events-none absolute inset-x-2 top-2 z-0 h-full overflow-hidden rounded-[1.6rem] border border-border bg-accent/35 transition-all duration-200 ease-out ${handoff ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.97] opacity-75"}`} aria-hidden="true">
          {previewDish ? (
            <div className={`flex h-full flex-col justify-between rounded-xl p-6 opacity-70 sm:p-8 ${accentClasses[previewDish.color]}`}>
              <div className="flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
                <span>next dish</span>
                <Sparkles className="size-4" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]">case file / ???</span>
            </div>
          ) : <div className="h-full bg-secondary/60" />}
        </div>
        <div
          className="relative z-10 aspect-[0.82] overflow-hidden rounded-[1.6rem] border-2 border-foreground bg-card p-5 dish-card-shadow transition-transform duration-200 ease-out sm:aspect-[1.15] sm:p-8"
          style={{ transform: `translateX(${dragX}px) rotate(${tilt}deg)`, transitionDuration: busy ? "280ms" : dragX === 0 ? "220ms" : "0ms" }}
        >
          {swipeLabel && <span className={`stamp absolute top-7 z-10 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.16em] ${dragX > 0 ? "right-7 text-primary" : "left-7 text-chart-5"}`}>{swipeLabel}</span>}
          <div className={`flex h-full flex-col justify-between rounded-xl p-6 sm:p-8 ${accentClasses[dish.color]}`}>
            <div className="flex items-start justify-between gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] opacity-70">case file / {String(dish.id).padStart(3, "0")}</span>
              <Sparkles className="size-5 shrink-0 opacity-60" />
            </div>
            <div className="max-w-xl">
              <div className="mb-6 text-6xl sm:text-8xl">{dish.answer === "real" ? <Utensils className="size-16 stroke-[1.15] sm:size-24" /> : <Sparkles className="size-16 stroke-[1.15] sm:size-24" />}</div>
              <h2 className="display-font max-w-xl text-4xl font-black leading-[0.94] sm:text-6xl">{dish.name}</h2>
              <p className="mt-6 max-w-lg text-lg leading-7 opacity-80 sm:text-xl">{dish.description}</p>
            </div>
            <div className="flex items-center justify-between border-t border-current/20 pt-5 font-mono text-[10px] uppercase tracking-[0.17em] opacity-70">
              <span>slide to decide</span><span>{dish.category}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-7 flex w-full max-w-2xl items-center justify-between gap-4">
        <Button type="button" variant="outline" onClick={() => onAnswer("fake")} disabled={busy} className="h-14 flex-1 rounded-full border-2 border-chart-5 bg-background font-mono text-xs font-bold uppercase tracking-[0.13em] text-chart-5 hover:bg-chart-5/10 hover:text-chart-5 sm:flex-none sm:px-8">
          <ArrowLeft className="size-4" /> Delusion
        </Button>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:block">or use ← / →</span>
        <Button type="button" onClick={() => onAnswer("real")} disabled={busy} className="h-14 flex-1 rounded-full border-2 border-foreground bg-foreground font-mono text-xs font-bold uppercase tracking-[0.13em] text-background hover:bg-foreground/90 sm:flex-none sm:px-8">
          Real dish <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}

function RevealScreen({ answer, round, score, onNext }: { answer: AnswerRecord; round: number; score: number; onNext: () => void }) {
  const isReal = answer.dish.answer === "real";
  return (
    <section className="flex flex-1 items-center justify-center py-12">
      <div className="reveal-stage float-in w-full max-w-2xl">
        <div className="mb-7 flex items-center justify-between font-mono text-xs uppercase tracking-[0.19em] text-muted-foreground">
          <span>the reveal · {String(round + 1).padStart(2, "0")} / {TOTAL_ROUNDS}</span>
          <span className={`score-feedback ${answer.correct ? "text-chart-2" : "text-primary"}`}>
            <span className="mr-3 hidden sm:inline">score {score} / {round + 1}</span>{answer.correct ? "you nailed it" : "plot twist"}
          </span>
        </div>
        <div className={`relative rounded-[1.6rem] border-2 border-foreground bg-card p-7 dish-card-shadow sm:p-12 ${answer.correct ? "reveal-correct" : "reveal-wrong"}`}>
          {answer.correct && <ConfettiBurst />}
          <div className="reveal-verdict flex flex-wrap items-center gap-4">
            <span className={`stamp px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.17em] ${answer.correct ? "text-chart-2" : "text-primary"}`}>
              {isReal ? "real dish" : "delusion"}
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.17em] text-muted-foreground">{answer.dish.name}</span>
          </div>
          <div className="reveal-body">
            <h1 className="display-font mt-9 text-5xl font-black leading-none sm:text-7xl">{answer.correct ? "You were right." : isReal ? "It was real." : "You caught the nonsense."}</h1>
            <div className="editorial-rule my-9" />
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">the story</p>
            <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">{answer.dish.reveal}</p>
            {!isReal && answer.dish.fakeExplanation && <p className="mt-5 border-l-2 border-accent pl-4 text-sm italic leading-6 text-muted-foreground">P.S. {answer.dish.fakeExplanation}</p>}
            <div className="mt-10 grid grid-cols-3 gap-3 border-t border-border pt-6">
              <Info label="origin" value={answer.dish.origin} />
              <Info label="category" value={answer.dish.category} />
              <Info label="verdict" value={isReal ? "real" : "fake"} />
            </div>
          </div>
        </div>
        <Button type="button" onClick={onNext} className="ink-button mt-8 h-14 w-full rounded-full bg-foreground font-mono text-xs font-bold uppercase tracking-[0.17em] text-background hover:bg-foreground">
          {round === TOTAL_ROUNDS - 1 ? "See my verdict" : "Next dish"} <ArrowRight className="size-4" />
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
  return (
    <section className="flex flex-1 items-center justify-center py-14">
      <div className="float-in w-full max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">your verdict</p>
        <h1 className="display-font mt-5 text-[clamp(5rem,16vw,10rem)] font-black leading-[0.8] text-foreground">{score}<span className="text-primary">/</span>10</h1>
        <p className="mt-7 font-mono text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">culinary chaos level</p>
        <div className="mx-auto my-10 max-w-lg rounded-[1.6rem] border-2 border-foreground bg-card p-7 dish-card-shadow sm:p-10">
          <div className="mx-auto mb-6 flex max-w-xs justify-center gap-1.5" aria-label={`${score} out of 10 correct`}>
            {Array.from({ length: 10 }, (_, index) => <span key={index} className={`h-3 flex-1 rounded-full ${index < score ? "bg-primary" : "bg-secondary"}`} />)}
          </div>
          <p className="display-font text-2xl italic leading-tight sm:text-3xl">“{message}”</p>
        </div>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={onAgain} className="ink-button h-13 rounded-full bg-primary px-8 font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary">Play again <RotateCcw className="size-4" /></Button>
          <Button type="button" variant="outline" onClick={onReview} className="h-13 rounded-full border-2 border-foreground bg-transparent px-8 font-mono text-xs font-bold uppercase tracking-[0.14em] text-foreground hover:bg-foreground hover:text-background">Review dishes</Button>
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
        <button type="button" onClick={onBack} className="mb-8 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.17em] text-muted-foreground transition-colors hover:text-foreground"><ChevronLeft className="size-4" /> back to verdict</button>
        <div className="mb-7 flex items-end justify-between">
          <div><p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">dish review</p><h1 className="display-font mt-2 text-4xl font-bold">The evidence locker</h1></div>
          <span className="font-mono text-xs uppercase tracking-[0.17em] text-muted-foreground">{String(index + 1).padStart(2, "0")} / {total}</span>
        </div>
        <div className="rounded-[1.6rem] border-2 border-foreground bg-card p-7 dish-card-shadow sm:p-11">
          <div className="flex items-center justify-between"><span className={`stamp px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.17em] ${answer.correct ? "text-chart-2" : "text-primary"}`}>{answer.correct ? "correct" : "missed"}</span><span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">you said: {answer.guess === "real" ? "real" : "delusion"}</span></div>
          <h2 className="display-font mt-10 text-5xl font-black leading-none sm:text-7xl">{answer.dish.name}</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{answer.dish.description}</p>
          <div className="editorial-rule my-8" />
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">{isReal ? "the real story" : "the delusion report"}</p>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">{answer.dish.reveal}</p>
          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-6"><Info label="origin" value={answer.dish.origin} /><Info label="category" value={answer.dish.category} /><Info label="verdict" value={isReal ? "real" : "fake"} /></div>
        </div>
        <div className="mt-8 flex justify-between gap-3"><Button type="button" variant="outline" onClick={onPrevious} disabled={index === 0} className="h-12 rounded-full border-2 border-foreground px-5 font-mono text-xs uppercase tracking-[0.15em]"><ArrowLeft className="size-4" /> previous</Button><Button type="button" variant="outline" onClick={onNext} disabled={index === total - 1} className="h-12 rounded-full border-2 border-foreground px-5 font-mono text-xs uppercase tracking-[0.15em]">next <ArrowRight className="size-4" /></Button></div>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{label}</p><p className="mt-1 text-sm font-semibold leading-5 text-foreground">{value}</p></div>;
}
"use client";
import { useEffect, useState } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  textColor = "text-white",
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  textColor?: string;
}) => {
  const [scope, animate] = useAnimate();
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const sentencesArray = words.includes("|") ? words.split("|") : [words];
  const wordsArray = sentencesArray[currentSentenceIndex].split(" ");

  useEffect(() => {
    const animateWords = async () => {
      await animate(
        "span",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
        },
        {
          duration: duration ? duration : 1,
          delay: stagger(0.2),
        }
      );

      // Wait for the animation to complete before transitioning to the next sentence
      setTimeout(() => {
        setCurrentSentenceIndex(
          (prevIndex) => (prevIndex + 1) % sentencesArray.length
        );
      }, 1000); // Fixed 1-second delay
    };

    animateWords();
  }, [
    currentSentenceIndex,
    animate,
    duration,
    filter,
    sentencesArray.length,
    wordsArray.length,
  ]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className={`${textColor} opacity-0`}
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className={`text-2xl leading-snug tracking-wide ${textColor}`}>
          {renderWords()}
        </div>
      </div>
    </div>
  );
};

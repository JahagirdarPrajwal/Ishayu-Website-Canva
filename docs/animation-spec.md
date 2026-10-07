# ISHAYU — master animation specification

Written by Prajwal. This is the source of truth for animation direction.
The OriginKit API key that appeared in the original has been redacted.
Component source blocks below are reference implementations from React Bits —
see CLAUDE.md for which need forking before use.

---

okay so it has generated and replicated the website one on one but now i want to add animations in this part properl so i have uploaded the image here and ill list what animations i want to add and what to do accodingly we will discuss and then once approved you give the exact prompt and if any links i mentione or source code or anything to add and copy it 

- before the website first loads i want a cool loading page so that when all the images takes its time to load and render instead of showing a website taking time we'll add a loading page but a really cool one and in a cool way it should go off so i was thinking that a a beigh offwhite page will come first as everything loads in the background and on that beige off white huge ishayu in green font will be return and as soon as it loads up this page wil go up in a smooth motion properly so maybe like for a few seconds it will be present 

- for the top header buttons home, products.. i want them to looklike this Add the Originkit "Tactile Button" component with the CLI:

npx originkit@latest add tactile-button --prompt

Authenticate with ORIGINKIT_API_KEY=<REDACTED — see your password manager> (export it in the shell before running the command).

- for the first page text " meet your new snack " i want it to have animation like this 

## Integrate the <BlurText /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: BlurText
### Variant: JavaScript + CSS
### Dependencies: motion

---

### Usage Example
```jsx
import BlurText from "./BlurText";

const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

<BlurText
  text="Isn't this so cool?!"
  delay={150}
  animateBy="words"
  direction="top"
  onAnimationComplete={handleAnimationComplete}
  className="text-2xl mb-8"
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | string | "" | The text content to animate. |
| animateBy | string | "words" | Determines whether to animate by 'words' or 'letters'. |
| direction | string | "top" | Direction from which the words/letters appear ('top' or 'bottom'). |
| delay | number | 200 | Delay between animations for each word/letter (in ms). |
| stepDuration | number | 0.35 | The time taken for each letter/word to animate (in seconds). |
| threshold | number | 0.1 | Intersection threshold for triggering the animation. |
| rootMargin | string | "0px" | Root margin for the intersection observer. |
| onAnimationComplete | function | undefined | Callback function triggered when all animations complete. |

### Full Component Source
```jsx
'use client';

import { motion } from 'motion/react';
import { useEffect, useRef, useState, useMemo } from 'react';

const buildKeyframes = (from, steps) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))]);

  const keyframes = {};
  keys.forEach(k => {
    keyframes[k] = [from[k], ...steps.map(s => s[k])];
  });
  return keyframes;
};

const BlurText = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = t => t,
  onAnimationComplete,
  stepDuration = 0.35
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo(
    () =>
      direction === 'top' ? { filter: 'blur(10px)', opacity: 0, y: -50 } : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: 'blur(5px)',
        opacity: 0.5,
        y: direction === 'top' ? 5 : -5
      },
      { filter: 'blur(0px)', opacity: 1, y: 0 }
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)));

  return (
    <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

        const spanTransition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000
        };
        spanTransition.ease = easing;

        return (
          <motion.span
            className="inline-block will-change-[transform,filter,opacity]"
            key={index}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={spanTransition}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </motion.span>
        );
      })}
    </p>
  );
};

export default BlurText;

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import and render the component using the usage example above as a starting point.
4. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


- the first page images need to come in a very good animation i dont want it to be normal or boring in a really creative way like something come from the screen and if you see the images are overlapping so it be like the image is falling from top and overlapping over each other one by one 

- for the last part of it " consider this your backup plan because ill eat later is not a stratergy " i want this to come in an animation like this and in that if you see the your backup plan is in blue text like its copied type so that needs to be real like so first the text comes in this format and the the blue select part comes and select that particular part of the sentence 

## Integrate the <TextType /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: TextType
### Variant: JavaScript + CSS
### Dependencies: gsap

---

### Usage Example
```jsx
import TextType from './TextType';

<TextType 
  text={["Text typing effect", "for your websites", "Happy coding!"]}
  typingSpeed={75}
  pauseDuration={1500}
  showCursor={true}
  cursorCharacter="|"
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | string | string[] | - | Text or array of texts to type out |
| as | ElementType | div | HTML tag to render the component as |
| typingSpeed | number | 50 | Speed of typing in milliseconds |
| initialDelay | number | 0 | Initial delay before typing starts |
| pauseDuration | number | 2000 | Time to wait between typing and deleting |
| deletingSpeed | number | 30 | Speed of deleting characters |
| loop | boolean | true | Whether to loop through texts array |
| className | string | '' | Optional class name for styling |
| showCursor | boolean | true | Whether to show the cursor |
| hideCursorWhileTyping | boolean | false | Hide cursor while typing |
| cursorCharacter | string | React.ReactNode | | | Character or React node to use as cursor |
| cursorBlinkDuration | number | 0.5 | Animation duration for cursor blinking |
| cursorClassName | string | '' | Optional class name for cursor styling |
| textColors | string[] | [] | Array of colors for each sentence |
| variableSpeed | {min: number, max: number} | undefined | Random typing speed within range for human-like feel |
| onSentenceComplete | (sentence: string, index: number) => void | undefined | Callback fired after each sentence is finished |
| startOnVisible | boolean | false | Start typing when component is visible in viewport |
| reverseMode | boolean | false | Type backwards (right to left) |

### Full Component Source
```jsx
'use client';

import { useEffect, useRef, useState, createElement, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import './TextType.css';

const TextType = ({
  text,
  as: Component = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const cursorRef = useRef(null);
  const containerRef = useRef(null);

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  const getCurrentTextColor = () => {
    if (textColors.length === 0) return 'inherit';
    return textColors[currentTextIndex % textColors.length];
  };

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (showCursor && cursorRef.current) {
      gsap.set(cursorRef.current, { opacity: 1 });
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    }
  }, [showCursor, cursorBlinkDuration]);

  useEffect(() => {
    if (!isVisible) return;

    let timeout;
    const currentText = textArray[currentTextIndex];
    const processedText = reverseMode ? currentText.split('').reverse().join('') : currentText;

    const executeTypingAnimation = () => {
      if (isDeleting) {
        if (displayedText === '') {
          setIsDeleting(false);
          if (currentTextIndex === textArray.length - 1 && !loop) {
            return;
          }

          if (onSentenceComplete) {
            onSentenceComplete(textArray[currentTextIndex], currentTextIndex);
          }

          setCurrentTextIndex(prev => (prev + 1) % textArray.length);
          setCurrentCharIndex(0);
          timeout = setTimeout(() => {}, pauseDuration);
        } else {
          timeout = setTimeout(() => {
            setDisplayedText(prev => prev.slice(0, -1));
          }, deletingSpeed);
        }
      } else {
        if (currentCharIndex < processedText.length) {
          timeout = setTimeout(
            () => {
              setDisplayedText(prev => prev + processedText[currentCharIndex]);
              setCurrentCharIndex(prev => prev + 1);
            },
            variableSpeed ? getRandomSpeed() : typingSpeed
          );
        } else if (textArray.length >= 1) {
          if (!loop && currentTextIndex === textArray.length - 1) return;
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
        }
      }
    };

    if (currentCharIndex === 0 && !isDeleting && displayedText === '') {
      timeout = setTimeout(executeTypingAnimation, initialDelay);
    } else {
      executeTypingAnimation();
    }

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentCharIndex,
    displayedText,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    textArray,
    currentTextIndex,
    loop,
    initialDelay,
    isVisible,
    reverseMode,
    variableSpeed,
    onSentenceComplete
  ]);

  const shouldHideCursor =
    hideCursorWhileTyping && (currentCharIndex < textArray[currentTextIndex].length || isDeleting);

  return createElement(
    Component,
    {
      ref: containerRef,
      className: `text-type ${className}`,
      ...props
    },
    <span className="text-type__content" style={{ color: getCurrentTextColor() || 'inherit' }}>
      {displayedText}
    </span>,
    showCursor && (
      <span
        ref={cursorRef}
        className={`text-type__cursor ${cursorClassName} ${shouldHideCursor ? 'text-type__cursor--hidden' : ''}`}
      >
        {cursorCharacter}
      </span>
    )
  );
};

export default TextType;

```

### Component CSS
```css
.text-type {
  display: inline-block;
  white-space: pre-wrap;
}

.text-type__cursor {
  margin-left: 0.25rem;
  display: inline-block;
  opacity: 1;
}

.text-type__cursor--hidden {
  display: none;
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


This is the first part of the website or the first thing they see, i want all the animation told here to be in real time properly and should look smooth and simultaneously with the scroll and alot of it is image becoz it was cropped out of the original image for refernce but i want you to not make it into image but real life text and everything instead of having it in the image type thing so it will be better and be creative with the animations and make it properly 


for the next part of the page " The everyday edit " part 

- as soon as i scroll down the rack lines i want it to pop from left one by one and then those elements " headphones" wallet, tumbler etc should pop up or can come from below or anything which is best and i want them to move around the rack lines like slow hovering over like as if its in space and how astronaut floats around type and the main part is i want it in a way like i can touch it and drag and move around but not all over that page or all over the website but just like over the racks part like imagine those lines or racks is a square type are but dont make a square this is just to tell how it will be and that the elemenst that is teh headphones wallet etc are freely moving around slowly in that square type area and once u hold it u can move it around how u like and once you leave that element it starts with its original free motion and same with other element lets say i have held on to one so that element wont move but let other element move so like if one element is held by me that should not stop other element movement as well and that rack i want it to be the first thing to come out from left like from left it should come on to the screen slowly to its position and as i scroll other racks should also come but make sure you time the speed and everything according to scroll as other element of that part of webpage also depends on scrolling as well

- after the racks and elements pop up and as lilltle bit more scroll down ( make sure that scroll down here means that i just entered that white part of the website and not that i have scrolled all the way down so make sure you time that above asked rack and element popping time properly ) the main heading text " the everyday edit" should have this particular animation given below and make sure it is for this heading only and not for the text part below and once this text comes out i want that yellow highlight on the edit to come in animation starting from left side or the letter e all the way to where it supposed to end 

## Integrate the <BlurText /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: BlurText
### Variant: JavaScript + CSS
### Dependencies: motion

---

### Usage Example
```jsx
import BlurText from "./BlurText";

const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

<BlurText
  text="Isn't this so cool?!"
  delay={150}
  animateBy="words"
  direction="top"
  onAnimationComplete={handleAnimationComplete}
  className="text-2xl mb-8"
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | string | "" | The text content to animate. |
| animateBy | string | "words" | Determines whether to animate by 'words' or 'letters'. |
| direction | string | "top" | Direction from which the words/letters appear ('top' or 'bottom'). |
| delay | number | 200 | Delay between animations for each word/letter (in ms). |
| stepDuration | number | 0.35 | The time taken for each letter/word to animate (in seconds). |
| threshold | number | 0.1 | Intersection threshold for triggering the animation. |
| rootMargin | string | "0px" | Root margin for the intersection observer. |
| onAnimationComplete | function | undefined | Callback function triggered when all animations complete. |

### Full Component Source
```jsx
'use client';

import { motion } from 'motion/react';
import { useEffect, useRef, useState, useMemo } from 'react';

const buildKeyframes = (from, steps) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))]);

  const keyframes = {};
  keys.forEach(k => {
    keyframes[k] = [from[k], ...steps.map(s => s[k])];
  });
  return keyframes;
};

const BlurText = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = t => t,
  onAnimationComplete,
  stepDuration = 0.35
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo(
    () =>
      direction === 'top' ? { filter: 'blur(10px)', opacity: 0, y: -50 } : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: 'blur(5px)',
        opacity: 0.5,
        y: direction === 'top' ? 5 : -5
      },
      { filter: 'blur(0px)', opacity: 1, y: 0 }
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)));

  return (
    <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

        const spanTransition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000
        };
        spanTransition.ease = easing;

        return (
          <motion.span
            className="inline-block will-change-[transform,filter,opacity]"
            key={index}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={spanTransition}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </motion.span>
        );
      })}
    </p>
  );
};

export default BlurText;

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import and render the component using the usage example above as a starting point.
4. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


- after the main headline i want the below paragraph phone, keys, headphone .... paragraph to come up with word by word and sentence by sentence in this animation below but dont make it very slow or very fast but at perfect rate taking care of the scroll part as by now i am almost entered that white part of the website 

## Integrate the <TextType /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: TextType
### Variant: JavaScript + CSS
### Dependencies: gsap

---

### Usage Example
```jsx
import TextType from './TextType';

<TextType 
  text={["Text typing effect", "for your websites", "Happy coding!"]}
  typingSpeed={75}
  pauseDuration={1500}
  showCursor={true}
  cursorCharacter="|"
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | string | string[] | - | Text or array of texts to type out |
| as | ElementType | div | HTML tag to render the component as |
| typingSpeed | number | 50 | Speed of typing in milliseconds |
| initialDelay | number | 0 | Initial delay before typing starts |
| pauseDuration | number | 2000 | Time to wait between typing and deleting |
| deletingSpeed | number | 30 | Speed of deleting characters |
| loop | boolean | true | Whether to loop through texts array |
| className | string | '' | Optional class name for styling |
| showCursor | boolean | true | Whether to show the cursor |
| hideCursorWhileTyping | boolean | false | Hide cursor while typing |
| cursorCharacter | string | React.ReactNode | | | Character or React node to use as cursor |
| cursorBlinkDuration | number | 0.5 | Animation duration for cursor blinking |
| cursorClassName | string | '' | Optional class name for cursor styling |
| textColors | string[] | [] | Array of colors for each sentence |
| variableSpeed | {min: number, max: number} | undefined | Random typing speed within range for human-like feel |
| onSentenceComplete | (sentence: string, index: number) => void | undefined | Callback fired after each sentence is finished |
| startOnVisible | boolean | false | Start typing when component is visible in viewport |
| reverseMode | boolean | false | Type backwards (right to left) |

### Full Component Source
```jsx
'use client';

import { useEffect, useRef, useState, createElement, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import './TextType.css';

const TextType = ({
  text,
  as: Component = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const cursorRef = useRef(null);
  const containerRef = useRef(null);

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  const getCurrentTextColor = () => {
    if (textColors.length === 0) return 'inherit';
    return textColors[currentTextIndex % textColors.length];
  };

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (showCursor && cursorRef.current) {
      gsap.set(cursorRef.current, { opacity: 1 });
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    }
  }, [showCursor, cursorBlinkDuration]);

  useEffect(() => {
    if (!isVisible) return;

    let timeout;
    const currentText = textArray[currentTextIndex];
    const processedText = reverseMode ? currentText.split('').reverse().join('') : currentText;

    const executeTypingAnimation = () => {
      if (isDeleting) {
        if (displayedText === '') {
          setIsDeleting(false);
          if (currentTextIndex === textArray.length - 1 && !loop) {
            return;
          }

          if (onSentenceComplete) {
            onSentenceComplete(textArray[currentTextIndex], currentTextIndex);
          }

          setCurrentTextIndex(prev => (prev + 1) % textArray.length);
          setCurrentCharIndex(0);
          timeout = setTimeout(() => {}, pauseDuration);
        } else {
          timeout = setTimeout(() => {
            setDisplayedText(prev => prev.slice(0, -1));
          }, deletingSpeed);
        }
      } else {
        if (currentCharIndex < processedText.length) {
          timeout = setTimeout(
            () => {
              setDisplayedText(prev => prev + processedText[currentCharIndex]);
              setCurrentCharIndex(prev => prev + 1);
            },
            variableSpeed ? getRandomSpeed() : typingSpeed
          );
        } else if (textArray.length >= 1) {
          if (!loop && currentTextIndex === textArray.length - 1) return;
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
        }
      }
    };

    if (currentCharIndex === 0 && !isDeleting && displayedText === '') {
      timeout = setTimeout(executeTypingAnimation, initialDelay);
    } else {
      executeTypingAnimation();
    }

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentCharIndex,
    displayedText,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    textArray,
    currentTextIndex,
    loop,
    initialDelay,
    isVisible,
    reverseMode,
    variableSpeed,
    onSentenceComplete
  ]);

  const shouldHideCursor =
    hideCursorWhileTyping && (currentCharIndex < textArray[currentTextIndex].length || isDeleting);

  return createElement(
    Component,
    {
      ref: containerRef,
      className: `text-type ${className}`,
      ...props
    },
    <span className="text-type__content" style={{ color: getCurrentTextColor() || 'inherit' }}>
      {displayedText}
    </span>,
    showCursor && (
      <span
        ref={cursorRef}
        className={`text-type__cursor ${cursorClassName} ${shouldHideCursor ? 'text-type__cursor--hidden' : ''}`}
      >
        {cursorCharacter}
      </span>
    )
  );
};

export default TextType;

```

### Component CSS
```css
.text-type {
  display: inline-block;
  white-space: pre-wrap;
}

.text-type__cursor {
  margin-left: 0.25rem;
  display: inline-block;
  opacity: 1;
}

.text-type__cursor--hidden {
  display: none;
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.



- now after this if you see in the image their is that small notes reminder thing now that you have added it as an image ofc i want it to change and i have added that image of only the notes reminder grey part image as ishayu webpage (9) image and then on the text should appear in that typed animation style as above but it should come line by line so first reminder will come and then next sentence first word and similarly all the part and when the last word is typed out the highlighting or the selected thing which is on the reminder there should come and select or highlight the reminder text properly in a smooth animation part 	



now this is for the second part of the webpage that white part one and make sure you time all the animation properly according to the scroll of the webpage and according to where and which part of the webpage i am on and dont make it very fast or very slow type 


for the next part of the page 

- so for that text make your better choice text i want you to follow the same animation style which you did for the previous parts text ( " the everyday edit " )  like that same animation i want it to come and then just like previous part yellow line animation i want it the same yellow line animation on the better choice text and that it should start from b or wherever the starting part is and goes till wherever it is supposed to end properly in a smooth way as it is given in the previous part of it 

- and then as i scroll down the products here have 4 images given which i dont want and i have added 4 images in the folder named coatz for the first image, protein bar for the second image, blend for the third image and nurtibite for the 4th image of it and so as i scroll down those images should come from below or pop up and should be on screen levitating up and down slowly and normal levitation and not very big type so yes thats one thing and make sure you time it well with the scroll part of the website 


this is for the 3rd part of the website and make sure you dont add those images for the texts on the the top heading i want legit texts, if you cant find the exact font then ask what to do about it ( ask something like can i use this font which i available open source and looks exactly or nearly same or will i download and give it to you something like this ) and take care of the animation , levitation , highlight part of it according to thr scroll and time it well


for the 4th part of the website that green ground and that guy in it so here i want you to keep the background that is the green background and the guy same and no animation required the background let it be there as it is in this but rest all nothing should be there as i scroll down 

- as i scroll down the top left element of the internet explorer icon should occur in a pixel unfold animation way so yeah you might have to make that image again or have that animation thing but make sure you replicate that image style and the background placement of it aand everything of it properly 

- as i scroll down even more that heading " chase the aura and the energy " it should have the same affect and animation  as the 3rd page and 2nd page had it for the texts ( make your better choices , the eveyday edit thing ) as all of them are headings and i am trying to maintain a consistent thing so i want that same blurtext effects on it and the yellow highlight late on the aura part but make sure you copy the aura placement properly as its not on the word aura completely its lil bit on top and i want it like that only 

- as i scroll lil bit more down that paragraph find your game, you might find your energy ..... that paragraph should come now in again the same way as the part 2 of the website para came ( phone , keys , headphones ... ) i want that same type text effect here as well too for this paragraph and make sure you time it well with the animation properly 

- as i scroll lil bit more down the major part comes, here in the backgrodun its green bg with a guy running on it so i have extracted the guy element out of the complete picture and its in png format named as ishayu website 10 and so ill mention an orbit animation here and i want that orbit animation to occur as soon as i scroll down around the guy and make sure i you take the animation behind the guy as well like properly should feel like that guy is in the centre of the orbit of it ( if by chance if its not possible then tell me about it ill tell what to do for it ) and in that orbit animation i want you to add those 4 images of game ( snackslash, astrofuel, fuelrally, snackrash) to be on the orbit and that it should rotate properly on the orbit as shown and make sure you time this properly with the scroll as well

## Integrate the <OrbitImages /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: OrbitImages
### Variant: JavaScript + CSS
### Dependencies: motion

---

### Usage Example
```jsx
// Component created by Dominik Koch
// https://x.com/dominikkoch

import OrbitImages from './OrbitImages'

const images = [
  "https://picsum.photos/300/300?grayscale&random=1",
  "https://picsum.photos/300/300?grayscale&random=2",
  "https://picsum.photos/300/300?grayscale&random=3",
  "https://picsum.photos/300/300?grayscale&random=4",
  "https://picsum.photos/300/300?grayscale&random=5",
  "https://picsum.photos/300/300?grayscale&random=6",
];

<OrbitImages
  images={images}
  shape="ellipse"
  radiusX={340}
  radiusY={80}
  rotation={-8}
  duration={30}
  itemSize={80}
  responsive={true}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| images | string[] | [] | Array of image URLs to orbit along the path. |
| altPrefix | string | "Orbiting image" | Prefix for auto-generated alt attributes. |
| shape | string | "ellipse" | Preset shape: ellipse, circle, square, rectangle, triangle, star, heart, infinity, wave, or custom. |
| customPath | string | undefined | Custom SVG path string (used when shape="custom"). |
| baseWidth | number | 1400 | Base width for the design coordinate space used for responsive scaling. |
| radiusX | number | 700 | Horizontal radius for ellipse/rectangle shapes. |
| radiusY | number | 170 | Vertical radius for ellipse/rectangle shapes. |
| radius | number | 300 | Radius for circle, square, triangle, star, heart shapes. |
| starPoints | number | 5 | Number of points for star shape. |
| starInnerRatio | number | 0.5 | Inner radius ratio for star (0-1). |
| rotation | number | -8 | Rotation angle of the entire orbit path in degrees. |
| duration | number | 40 | Duration of one complete orbit in seconds. |
| itemSize | number | 64 | Width/height of each orbiting item in pixels. |
| direction | string | "normal" | Animation direction: "normal" or "reverse". |
| fill | boolean | true | Whether to distribute items evenly around the orbit. |
| width | number | "100%" | 100 | Container width in pixels or "100%". |
| height | number | "auto" | 100 | Container height in pixels or "auto". |
| className | string | "" | Additional CSS class for the container. |
| showPath | boolean | false | Whether to show the orbit path for debugging. |
| pathColor | string | "rgba(0,0,0,0.1)" | Stroke color when showPath is true. |
| pathWidth | number | 2 | Stroke width when showPath is true. |
| easing | string | "linear" | Animation easing: linear, easeIn, easeOut, easeInOut. |
| paused | boolean | false | Whether the animation is paused. |
| centerContent | ReactNode | undefined | Custom content rendered at the center of the orbit. |
| responsive | boolean | false | Enable responsive scaling based on container width. |

### Full Component Source
```jsx
'use client';

// Component created by Dominik Koch
// https://x.com/dominikkoch

import { useMemo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import './OrbitImages.css';

function generateEllipsePath(cx, cy, rx, ry) {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;
}

function generateCirclePath(cx, cy, r) {
  return generateEllipsePath(cx, cy, r, r);
}

function generateSquarePath(cx, cy, size) {
  const h = size / 2;
  return `M ${cx - h} ${cy - h} L ${cx + h} ${cy - h} L ${cx + h} ${cy + h} L ${cx - h} ${cy + h} Z`;
}

function generateRectanglePath(cx, cy, w, h) {
  const hw = w / 2;
  const hh = h / 2;
  return `M ${cx - hw} ${cy - hh} L ${cx + hw} ${cy - hh} L ${cx + hw} ${cy + hh} L ${cx - hw} ${cy + hh} Z`;
}

function generateTrianglePath(cx, cy, size) {
  const height = (size * Math.sqrt(3)) / 2;
  const hs = size / 2;
  return `M ${cx} ${cy - height / 1.5} L ${cx + hs} ${cy + height / 3} L ${cx - hs} ${cy + height / 3} Z`;
}

function generateStarPath(cx, cy, outerR, innerR, points) {
  const step = Math.PI / points;
  let path = '';
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return path + ' Z';
}

function generateHeartPath(cx, cy, size) {
  const s = size / 30;
  return `M ${cx} ${cy + 12 * s} C ${cx - 20 * s} ${cy - 5 * s}, ${cx - 12 * s} ${cy - 18 * s}, ${cx} ${cy - 8 * s} C ${cx + 12 * s} ${cy - 18 * s}, ${cx + 20 * s} ${cy - 5 * s}, ${cx} ${cy + 12 * s}`;
}

function generateInfinityPath(cx, cy, w, h) {
  const hw = w / 2;
  const hh = h / 2;
  return `M ${cx} ${cy} C ${cx + hw * 0.5} ${cy - hh}, ${cx + hw} ${cy - hh}, ${cx + hw} ${cy} C ${cx + hw} ${cy + hh}, ${cx + hw * 0.5} ${cy + hh}, ${cx} ${cy} C ${cx - hw * 0.5} ${cy + hh}, ${cx - hw} ${cy + hh}, ${cx - hw} ${cy} C ${cx - hw} ${cy - hh}, ${cx - hw * 0.5} ${cy - hh}, ${cx} ${cy}`;
}

function generateWavePath(cx, cy, w, amplitude, waves) {
  const pts = [];
  const segs = waves * 20;
  const hw = w / 2;
  for (let i = 0; i <= segs; i++) {
    const x = cx - hw + (w * i) / segs;
    const y = cy + Math.sin((i / segs) * waves * 2 * Math.PI) * amplitude;
    pts.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }
  for (let i = segs; i >= 0; i--) {
    const x = cx - hw + (w * i) / segs;
    const y = cy - Math.sin((i / segs) * waves * 2 * Math.PI) * amplitude;
    pts.push(`L ${x} ${y}`);
  }
  return pts.join(' ') + ' Z';
}

function OrbitItem({ item, index, totalItems, path, itemSize, rotation, progress, fill }) {
  const itemOffset = fill ? (index / totalItems) * 100 : 0;

  const offsetDistance = useTransform(progress, (p) => {
    const offset = (((p + itemOffset) % 100) + 100) % 100;
    return `${offset}%`;
  });

  return (
    <motion.div
      className="orbit-item"
      style={{
        width: itemSize,
        height: itemSize,
        offsetPath: `path("${path}")`,
        offsetRotate: '0deg',
        offsetAnchor: 'center center',
        offsetDistance,
      }}
    >
      <div style={{ transform: `rotate(${-rotation}deg)` }}>{item}</div>
    </motion.div>
  );
}

export default function OrbitImages({
  images = [],
  altPrefix = 'Orbiting image',
  shape = 'ellipse',
  customPath,
  baseWidth = 1400,
  radiusX = 700,
  radiusY = 170,
  radius = 300,
  starPoints = 5,
  starInnerRatio = 0.5,
  rotation = -8,
  duration = 40,
  itemSize = 64,
  direction = 'normal',
  fill = true,
  width = 100,
  height = 100,
  className = '',
  showPath = false,
  pathColor = 'rgba(0,0,0,0.1)',
  pathWidth = 2,
  easing = 'linear',
  paused = false,
  centerContent,
  responsive = false,
}) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(null);

  const designCenterX = baseWidth / 2;
  const designCenterY = baseWidth / 2;

  const path = useMemo(() => {
    switch (shape) {
      case 'circle':
        return generateCirclePath(designCenterX, designCenterY, radius);
      case 'ellipse':
        return generateEllipsePath(designCenterX, designCenterY, radiusX, radiusY);
      case 'square':
        return generateSquarePath(designCenterX, designCenterY, radius * 2);
      case 'rectangle':
        return generateRectanglePath(designCenterX, designCenterY, radiusX * 2, radiusY * 2);
      case 'triangle':
        return generateTrianglePath(designCenterX, designCenterY, radius * 2);
      case 'star':
        return generateStarPath(designCenterX, designCenterY, radius, radius * starInnerRatio, starPoints);
      case 'heart':
        return generateHeartPath(designCenterX, designCenterY, radius * 2);
      case 'infinity':
        return generateInfinityPath(designCenterX, designCenterY, radiusX * 2, radiusY * 2);
      case 'wave':
        return generateWavePath(designCenterX, designCenterY, radiusX * 2, radiusY, 3);
      case 'custom':
        return customPath || generateCirclePath(designCenterX, designCenterY, radius);
      default:
        return generateEllipsePath(designCenterX, designCenterY, radiusX, radiusY);
    }
  }, [shape, customPath, designCenterX, designCenterY, radiusX, radiusY, radius, starPoints, starInnerRatio]);

  useLayoutEffect(() => {
    if (!responsive || !containerRef.current) return;
    const updateScale = () => {
      if (!containerRef.current) return;
      setScale(containerRef.current.clientWidth / baseWidth);
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [responsive, baseWidth]);

  const progress = useMotionValue(0);

  useEffect(() => {
    if (paused) return;
    const controls = animate(progress, direction === 'reverse' ? -100 : 100, {
      duration,
      ease: easing,
      repeat: Infinity,
      repeatType: 'loop',
    });
    return () => controls.stop();
  }, [progress, duration, easing, direction, paused]);

  const containerWidth = responsive ? '100%' : (typeof width === 'number' ? width : '100%');
  const containerHeight = responsive ? 'auto' : (typeof height === 'number' ? height : (typeof width === 'number' ? width : 'auto'));

  const items = images.map((src, index) => (
    <img
      key={src}
      src={src}
      alt={`${altPrefix} ${index + 1}`}
      draggable={false}
      className="orbit-image"
    />
  ));

  return (
    <div
      ref={containerRef}
      className={`orbit-container ${className}`}
      style={{
        width: containerWidth,
        height: containerHeight,
        aspectRatio: responsive ? '1 / 1' : undefined,
      }}
      aria-hidden="true"
    >
      <div
        className={responsive ? 'orbit-scaling-container orbit-scaling-container--responsive' : 'orbit-scaling-container'}
        style={{
          width: responsive ? baseWidth : '100%',
          height: responsive ? baseWidth : '100%',
          transform: responsive && scale !== null ? `translate(-50%, -50%) scale(${scale})` : undefined,
          visibility: responsive && scale === null ? 'hidden' : undefined,
        }}
      >
        <div
          className="orbit-rotation-wrapper"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {showPath && (
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${baseWidth} ${baseWidth}`}
              className="orbit-path-svg"
            >
              <path d={path} fill="none" stroke={pathColor} strokeWidth={pathWidth / (scale ?? 1)} />
            </svg>
          )}

          {items.map((item, index) => (
            <OrbitItem
              key={index}
              item={item}
              index={index}
              totalItems={items.length}
              path={path}
              itemSize={itemSize}
              rotation={rotation}
              progress={progress}
              fill={fill}
            />
          ))}
        </div>
      </div>

      {centerContent && (
        <div className="orbit-center-content">
          {centerContent}
        </div>
      )}
    </div>
  );
}

```

### Component CSS
```css
.orbit-container {
  position: relative;
  margin-left: auto;
  margin-right: auto;
}

.orbit-scaling-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.orbit-scaling-container--responsive {
  position: absolute;
  left: 50%;
  top: 50%;
  transform-origin: center center;
}

.orbit-rotation-wrapper {
  width: 100%;
  height: 100%;
  transform-origin: center center;
  position: relative;
}

.orbit-path-svg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orbit-item {
  position: absolute;
  will-change: transform;
  user-select: none;
}

.orbit-center-content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.orbit-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


- and as i scroll even more down the last part of it " find your better choice " its an heading type again so i want the same blurtext animation as you did above as well and then that as soon as all the text comes here i want that yellow highlight on the better choice to come from left to right starting from where its given to ending to where its given and should be smooth and not sudden fast thing and make it proper 

- after that the below para ( its not about following a perfevt routine ... ) its again a para so i want that same type text animation as you did for above texts in different parts to come for each word and it should go word by word to each sentence properly in smooth animation and way 

so now i have done for the 4th part of the website make sure you time all the animations properly and smoothly with the scrll and it shoyld not feel like i scrolled all the way down and then thing pop up and animate it should come as soon as i am on that part of it,


now its the 5th part of the website here as soon as i scroll i want it to be the blue main background as its given here already and i want you to then start with 

- as i scroll down in that empty page first thing which will come is the heading ( snack like you mean it ) and as its a heading i want the same blurtext effect as you did earlier properly and in the same way and then the yellow highlight text over the mean it part should come properly from left to right in a proper way as given in it from mean to it it should come in proper smooth way as done in above part and please make sure you dont add them as an image but a text

- so after this animation and little scroll down the image on the right slay.png of the beetroot and lemon should pop up using this given animation and make sure you time it properly with the scroll down part of it everything 

## Integrate the <undefined /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: undefined
### Variant: JavaScript + CSS
### Dependencies: @hugeicons/react @hugeicons/core-free-icons

---

### Usage Example
```jsx
import RefineFrame from './RefineFrame';

<RefineFrame
  status={job.status}
  aspectRatio="4 / 3"
  width={320}
  radius={16}
  background="#27272a"
  color="#f5f5f5"
  stageDuration={400}
  sweep
  showStatus
  hideAfter={1200}
  retryLabel="Retry"
  onRetry={() => job.restart()}
>
  <img src={job.url} alt={job.prompt} crossOrigin="anonymous" />
</RefineFrame>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| status | 'queued' | 'generating' | 'refining' | 'complete' | 'error' | 'generating' | The stage. Each change tweens the media to that stage. |
| children | ReactNode | - | The media: an img, video or canvas. It fills the frame. |
| aspectRatio | string | "4 / 3" | The box reserved before and during generation, so nothing shifts. |
| width | number | 320 | Frame width in px, capped at the parent. |
| radius | number | 16 | Corner radius in px. |
| background | string | "#27272a" | The paper behind the media, and the chip surface. |
| color | string | "#f5f5f5" | The ink: chip text, the sweep and the retry pill. |
| stageDuration | number | 400 | Each stage tween, in ms. |
| sweep | boolean | true | A soft band crosses the frame while it works. |
| showStatus | boolean | true | The chip with the mark and the stage label. |
| hideAfter | number | 1200 | Ms after completion before the chip fades. 0 keeps it. |
| labels | Partial<Record<status, string>> | DEFAULT_LABELS | Chip text per stage: Queued, Generating, Refining, Ready, Failed. |
| retryLabel | string | "Retry" | The pill on an error. |
| onRetry | () => void | - | The retry pill was pressed. Without it, no pill. |
| className | string | "" | Extra classes for the frame. |

### Full Component Source
```jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Alert02Icon, Loading03Icon, RefreshIcon, Tick02Icon } from '@hugeicons/core-free-icons';
import './RefineFrame.css';

const STAGES = {
  queued: { blur: 4, sat: 0.6, scale: 1.04, opacity: 0.55 },
  generating: { blur: 1.5, sat: 0.8, scale: 1.02, opacity: 0.85 },
  refining: { blur: 0.5, sat: 0.95, scale: 1.005, opacity: 1 },
  complete: { blur: 0, sat: 1, scale: 1, opacity: 1 },
  error: { blur: 2, sat: 0.5, scale: 1, opacity: 0.28 }
};
const TARGET = { queued: 0, generating: 0.5, refining: 0.875, complete: 1 };
const LEVELS = [48, 32, 20, 12, 8, 5, 3, 2, 1];
const EDGE = 28;
const STRIPS = 14;
const DEFAULT_LABELS = {
  queued: 'Queued',
  generating: 'Generating',
  refining: 'Refining',
  complete: 'Ready',
  error: 'Failed'
};
const ACTIVE = new Set(['queued', 'generating', 'refining']);

const build = (s, canvas, img, dpr) => {
  const rect = canvas.getBoundingClientRect();
  const W = Math.max(1, Math.round(rect.width * dpr));
  const H = Math.max(1, Math.round(rect.height * dpr));
  const key = `${img.currentSrc}|${W}x${H}`;
  if (s.key === key) return;
  s.key = key;
  s.w = W;
  s.h = H;
  canvas.width = W;
  canvas.height = H;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const cover = Math.max(W / iw, H / ih);
  const sw = W / cover;
  const sh = H / cover;
  const sx = (iw - sw) / 2;
  const sy = (ih - sh) / 2;
  const glint = canvas.getContext('2d')?.createLinearGradient(0, 0, W, 0) ?? null;
  if (glint) {
    for (const [at, a] of [
      [0, 0],
      [0.08, 0.1],
      [0.2, 0.7],
      [0.32, 1],
      [0.68, 1],
      [0.8, 0.7],
      [0.92, 0.1],
      [1, 0]
    ]) {
      glint.addColorStop(at, `rgba(255, 255, 255, ${a})`);
    }
  }
  s.glint = glint;
  s.levels = LEVELS.map(block => {
    const b = block === 1 ? 1 : Math.max(2, Math.round(block * dpr));
    const full = document.createElement('canvas');
    full.width = W;
    full.height = H;
    const fc = full.getContext('2d');
    if (!fc) return full;
    if (b === 1) {
      fc.imageSmoothingEnabled = true;
      fc.imageSmoothingQuality = 'high';
      fc.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
      return full;
    }
    const small = document.createElement('canvas');
    small.width = Math.max(1, Math.round(W / b));
    small.height = Math.max(1, Math.round(H / b));
    const sc = small.getContext('2d');
    if (sc) {
      sc.imageSmoothingEnabled = true;
      sc.imageSmoothingQuality = 'high';
      sc.drawImage(img, sx, sy, sw, sh, 0, 0, small.width, small.height);
    }
    fc.imageSmoothingEnabled = false;
    fc.drawImage(small, 0, 0, W, H);
    return full;
  });
};

export default function RefineFrame({
  status = 'generating',
  children,
  aspectRatio = '4 / 3',
  width = 320,
  radius = 16,
  background = '#27272a',
  color = '#f5f5f5',
  stageDuration = 400,
  sweep = true,
  showStatus = true,
  hideAfter = 1200,
  labels = DEFAULT_LABELS,
  retryLabel = 'Retry',
  onRetry,
  className = ''
}) {
  const stage = STAGES[status] ?? STAGES.generating;
  const active = ACTIVE.has(status);
  const text = { ...DEFAULT_LABELS, ...labels };
  const printRef = useRef(null);
  const canvasRef = useRef(null);
  const sim = useRef({ p: 0, raf: 0, last: 0, key: '', w: 0, h: 0, levels: [], glint: null, sent: false });
  const live = useRef({});
  live.current = { status, stageDuration, sweep, reduce: false };
  const [mosaic, setMosaic] = useState(false);
  const [resolved, setResolved] = useState(false);

  const [chip, setChip] = useState(showStatus);
  const timer = useRef(undefined);
  useEffect(() => {
    clearTimeout(timer.current);
    if (!showStatus) {
      setChip(false);
      return undefined;
    }
    setChip(true);
    if (status === 'complete' && hideAfter > 0) {
      timer.current = setTimeout(() => setChip(false), hideAfter);
    }
    return () => clearTimeout(timer.current);
  }, [status, showStatus, hideAfter]);

  const tick = now => {
    const s = sim.current;
    const c = live.current;
    const canvas = canvasRef.current;
    const img = printRef.current?.querySelector('img');
    if (!canvas || !img || !img.naturalWidth) {
      s.raf = 0;
      return;
    }
    const dt = Math.min(0.05, s.last ? (now - s.last) / 1000 : 0.016);
    s.last = now;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    build(s, canvas, img, dpr);
    const n = s.levels.length - 1;
    const target = TARGET[c.status] ?? s.p;
    const rate = c.reduce ? 1e9 : 1 / (n * (c.stageDuration / 1000));
    const step = rate * dt;
    if (target < s.p) s.p = target;
    else if (target - s.p <= step) s.p = target;
    else s.p += step;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const L = s.p * n;
      const i = Math.min(n, Math.floor(L + 1e-6));
      const frac = L - i;
      ctx.globalAlpha = 1;
      ctx.drawImage(s.levels[i], 0, 0);
      if (i < n && frac > 0) {
        const edge = EDGE * dpr;
        const front = frac * (s.h + edge) - edge / 2;
        const top = Math.max(0, Math.floor(front - edge / 2));
        if (top > 0) ctx.drawImage(s.levels[i + 1], 0, 0, s.w, top, 0, 0, s.w, top);
        const sh = edge / STRIPS;
        for (let k = 0; k < STRIPS; k += 1) {
          const y = front - edge / 2 + k * sh;
          if (y + sh <= 0 || y >= s.h) continue;
          const t = 1 - (k + 0.5) / STRIPS;
          ctx.globalAlpha = t * t * (3 - 2 * t);
          const y0 = Math.max(0, y);
          const h0 = Math.min(s.h, y + sh) - y0;
          if (h0 > 0) ctx.drawImage(s.levels[i + 1], 0, y0, s.w, h0, 0, y0, s.w, h0);
        }
        ctx.globalAlpha = 1;
        if (c.sweep && !c.reduce && s.glint && front > 0 && front < s.h) {
          ctx.fillStyle = s.glint;
          ctx.globalAlpha = 0.12;
          ctx.fillRect(0, front - 2 * dpr, s.w, 4 * dpr);
          ctx.globalAlpha = 0.3;
          ctx.fillRect(0, front - dpr, s.w, 2 * dpr);
          ctx.globalAlpha = 1;
        }
      }
    }
    const done = s.p >= 1;
    if (done !== s.sent) {
      s.sent = done;
      setResolved(done);
    }
    const keep = (!c.reduce && ACTIVE.has(c.status)) || Math.abs(target - s.p) > 0.0005;
    s.raf = keep ? requestAnimationFrame(tick) : 0;
    if (!keep) s.last = 0;
  };
  const wake = () => {
    const s = sim.current;
    if (!s.raf) s.raf = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      live.current.reduce = mq.matches;
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const img = printRef.current?.querySelector('img');
    if (!img) {
      setMosaic(false);
      return undefined;
    }
    let gone = false;
    const start = () => {
      if (gone) return;
      setMosaic(true);
      wake();
    };
    if (img.complete && img.naturalWidth) start();
    else img.addEventListener('load', start, { once: true });
    return () => {
      gone = true;
      img.removeEventListener('load', start);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, status]);

  useEffect(() => {
    wake();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, width, aspectRatio]);

  useEffect(() => {
    const s = sim.current;
    return () => cancelAnimationFrame(s.raf);
  }, []);

  return (
    <div
      className={`refine-frame${className ? ` ${className}` : ''}`}
      role="img"
      aria-label={text[status] ?? status}
      aria-busy={active || undefined}
      data-status={status}
      data-active={active ? '' : undefined}
      data-sweep={sweep && active ? '' : undefined}
      data-mosaic={mosaic ? '' : undefined}
      data-resolved={mosaic && resolved ? '' : undefined}
      style={{
        '--rf-w': `${width}px`,
        '--rf-aspect': aspectRatio,
        '--rf-radius': `${radius}px`,
        '--rf-bg': background,
        '--rf-ink': color,
        '--rf-stage': `${stageDuration}ms`,
        '--rf-blur': `${mosaic ? 0 : stage.blur}px`,
        '--rf-sat': stage.sat,
        '--rf-scale': mosaic ? 1 : stage.scale,
        '--rf-opacity': stage.opacity
      }}
    >
      <div className="refine-frame__media" aria-hidden="true">
        <div ref={printRef} className="refine-frame__print">
          {children}
        </div>
        <canvas ref={canvasRef} className="refine-frame__mosaic" />
      </div>
      <div className="refine-frame__sweep" aria-hidden="true" />
      {chip ? (
        <div className="refine-frame__chip" aria-hidden="true">
          <span className="refine-frame__mark" data-kind={active ? 'spin' : status}>
            {status === 'complete' ? (
              <HugeiconsIcon icon={Tick02Icon} size={13} strokeWidth={2.5} />
            ) : status === 'error' ? (
              <HugeiconsIcon icon={Alert02Icon} size={13} strokeWidth={2.2} />
            ) : (
              <HugeiconsIcon icon={Loading03Icon} size={13} strokeWidth={2.2} />
            )}
          </span>
          <span key={status} className="refine-frame__label">
            {text[status] ?? status}
          </span>
        </div>
      ) : null}
      {status === 'error' && onRetry ? (
        <button type="button" className="refine-frame__retry" onClick={onRetry}>
          <HugeiconsIcon icon={RefreshIcon} size={14} strokeWidth={2.2} />
          <span>{retryLabel}</span>
        </button>
      ) : null}
      <span className="refine-frame__sr" role="status">
        {text[status] ?? status}
      </span>
    </div>
  );
}

```

### Component CSS
```css
.refine-frame {
  --rf-w: 320px;
  --rf-aspect: 4 / 3;
  --rf-radius: 16px;
  --rf-bg: #27272a;
  --rf-ink: #f5f5f5;
  --rf-stage: 400ms;
  --rf-blur: 1.5px;
  --rf-sat: 0.8;
  --rf-scale: 1.02;
  --rf-opacity: 0.85;
  --rf-error: #ef4444;
  --rf-ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  position: relative;
  isolation: isolate;
  width: min(var(--rf-w), 100%);
  aspect-ratio: var(--rf-aspect);
  border-radius: var(--rf-radius);
  overflow: hidden;
  background: var(--rf-bg);
  color: var(--rf-ink);
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
}

.refine-frame__media {
  position: absolute;
  inset: 0;
  opacity: var(--rf-opacity);
  filter: blur(var(--rf-blur)) saturate(var(--rf-sat));
  transform: scale(var(--rf-scale));
  transition:
    opacity var(--rf-stage) var(--rf-ease-out),
    filter var(--rf-stage) var(--rf-ease-out),
    transform var(--rf-stage) var(--rf-ease-out);
}

.refine-frame[data-status='queued'] .refine-frame__media {
  animation: refine-frame-wait 2.4s ease-in-out infinite;
}

@keyframes refine-frame-wait {
  0%,
  100% {
    opacity: 0.45;
  }

  50% {
    opacity: 0.65;
  }
}

.refine-frame__print {
  width: 100%;
  height: 100%;
  transition: opacity var(--rf-stage) ease;
}

.refine-frame__print > * {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.refine-frame[data-mosaic] .refine-frame__print {
  opacity: 0;
}

.refine-frame[data-resolved] .refine-frame__print {
  opacity: 1;
}

.refine-frame__mosaic {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--rf-stage) ease;
}

.refine-frame[data-mosaic] .refine-frame__mosaic {
  opacity: 1;
}

.refine-frame[data-resolved] .refine-frame__mosaic {
  opacity: 0;
}

.refine-frame__sweep {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    115deg,
    transparent 38%,
    color-mix(in srgb, var(--rf-ink) 14%, transparent) 50%,
    transparent 62%
  );
  background-size: 260% 100%;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--rf-stage) ease;
}

.refine-frame[data-sweep]:not([data-mosaic]) .refine-frame__sweep {
  opacity: 1;
  animation: refine-frame-sweep 2.2s linear infinite;
}

@keyframes refine-frame-sweep {
  from {
    background-position: 130% 0;
  }

  to {
    background-position: -130% 0;
  }
}

.refine-frame__chip {
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding: 0 10px 0 8px;
  border-radius: 13px;
  background: color-mix(in srgb, var(--rf-bg) 72%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  opacity: 1;
  transform: translateY(0);
  pointer-events: none;
  transition:
    opacity 200ms ease,
    transform 200ms var(--rf-ease-out);
}

@starting-style {
  .refine-frame__chip {
    opacity: 0;
    transform: translateY(4px);
  }
}

.refine-frame__mark {
  display: inline-flex;
  color: color-mix(in srgb, var(--rf-ink) 80%, transparent);
}

.refine-frame__mark[data-kind='spin'] {
  animation: refine-frame-spin 1.1s linear infinite;
}

.refine-frame__mark[data-kind='error'] {
  color: var(--rf-error);
}

@keyframes refine-frame-spin {
  to {
    transform: rotate(360deg);
  }
}

.refine-frame__label {
  animation: refine-frame-label 200ms ease both;
}

@keyframes refine-frame-label {
  from {
    opacity: 0;
    filter: blur(2px);
  }
}

.refine-frame__retry {
  position: absolute;
  top: 50%;
  left: 50%;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 14px 0 12px;
  border: 0;
  border-radius: 16px;
  background: color-mix(in srgb, var(--rf-ink) 14%, var(--rf-bg));
  color: var(--rf-ink);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
  -webkit-tap-highlight-color: transparent;
  transition:
    opacity 200ms ease,
    transform 160ms var(--rf-ease-out),
    background-color 150ms ease;
}

@starting-style {
  .refine-frame__retry {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.96);
  }
}

.refine-frame__retry:active {
  transform: translate(-50%, -50%) scale(0.96);
}

@media (hover: hover) and (pointer: fine) {
  .refine-frame__retry:hover {
    background: color-mix(in srgb, var(--rf-ink) 20%, var(--rf-bg));
  }
}

.refine-frame__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .refine-frame__media {
    transition: opacity var(--rf-stage) ease;
  }

  .refine-frame[data-sweep] .refine-frame__sweep {
    animation: none;
    opacity: 0;
  }

  .refine-frame[data-status='queued'] .refine-frame__media {
    animation: none;
  }

  .refine-frame__mark[data-kind='spin'] {
    animation: none;
  }

  .refine-frame__chip,
  .refine-frame__retry {
    transition: opacity 200ms ease;
  }

  .refine-frame__retry:active {
    transform: translate(-50%, -50%);
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


- after that image comes out with this particulary animation next thing i want is the texts on the left side those paragraphs ( the right snack .. need it. ) so for this 4 line i want that same text type animation which you did earlier i want the same and make sure you start from word to word to sentence in a proper way as its given 

- so after that para i want those two lines below which is in bold ( choose your moment, choose your ishayu ) thing should be animated in this given animation form and make sure you maintain the timing of above paragraph animation and with this, i dont want both to happen together but right after that above para it should start with the animation

## Integrate the <FoldText /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: FoldText
### Variant: JavaScript + CSS
### Dependencies: gsap

---

### Usage Example
```jsx
import FoldText from './FoldText';

<FoldText
  text="Launch with clarity"
  splitBy="char"
  hinge="top"
  trigger="scroll"
  duration={0.65}
  stagger={0.045}
  ease="power3.out"
  perspective={700}
  creaseShading={0.55}
  fontSize="clamp(3rem, 10vw, 7rem)"
  fontWeight={800}
  color="#f7f2e8"
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | string | "Design unfolds" | The text content to split and fold into place. |
| splitBy | "char" | "word" | "line" | "char" | Controls whether each character, word, or explicit line folds as a panel. |
| hinge | "top" | "bottom" | "left" | "right" | "top" | The edge that acts as the 3D fold hinge. |
| duration | number | 0.65 | Duration in seconds for each panel to unfold. |
| stagger | number | 0.045 | Delay in seconds between panels; 0.03–0.08 keeps the cascade crisp. |
| ease | string | "power3.out" | GSAP easing curve used by the unfold timeline. |
| perspective | number | 700 | Perspective distance applied to each panel parent. |
| creaseShading | number | 0.55 | Strength of the gradient shade while panels are folded. |
| trigger | "mount" | "hover" | "scroll" | "loop" | "mount" | Determines when the unfold animation starts. |
| fontSize | string | number | 80 | Font size applied to the root text. |
| fontWeight | string | number | 800 | Font weight applied to the root text. |
| color | string | "#f7f2e8" | Text color of the folded panels. |
| className | string | "" | Adds custom classes to the root element. |
| style | CSSProperties | {} | Inline style overrides for the root element. |

### Full Component Source
```jsx
'use client';

import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './FoldText.css';

gsap.registerPlugin(ScrollTrigger);

const HINGE_CONFIG = {
  top: { origin: '50% 0%', rotateX: -92, rotateY: 0 },
  bottom: { origin: '50% 100%', rotateX: 92, rotateY: 0 },
  left: { origin: '0% 50%', rotateX: 0, rotateY: 92 },
  right: { origin: '100% 50%', rotateX: 0, rotateY: -92 }
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const renderWhitespace = (value, key) =>
  value.split(/(\n)/).map((part, index) => {
    if (part === '\n') return <br key={`${key}-br-${index}`} />;
    if (!part) return null;

    return (
      <span className="fold-text-whitespace" key={`${key}-space-${index}`}>
        {part.replace(/ /g, '\u00A0')}
      </span>
    );
  });

const FoldText = ({
  text = 'Design unfolds',
  splitBy = 'char',
  hinge = 'top',
  duration = 0.65,
  stagger = 0.045,
  ease = 'power3.out',
  perspective = 700,
  creaseShading = 0.55,
  trigger = 'mount',
  fontSize = 80,
  fontWeight = 800,
  color = '#f7f2e8',
  className = '',
  style = {}
}) => {
  const rootRef = useRef(null);
  const timelineRef = useRef(null);
  const hingeConfig = HINGE_CONFIG[hinge] || HINGE_CONFIG.top;
  const safeCrease = clamp(creaseShading, 0, 1);
  const safePerspective = Math.max(120, perspective);

  const segments = useMemo(() => {
    let segmentIndex = 0;

    const renderSegment = (content, key, split = splitBy) => {
      segmentIndex += 1;
      return (
        <span
          className="fold-text-segment"
          data-fold-split={split}
          key={key}
          style={{ '--fold-perspective': `${safePerspective}px` }}
        >
          <span
            className="fold-text-piece"
            data-fold-hinge={hinge}
            style={{ transformOrigin: hingeConfig.origin, '--fold-crease': 0 }}
          >
            {content || '\u00A0'}
          </span>
        </span>
      );
    };

    if (splitBy === 'line') {
      return text.split('\n').map((line, index) => (
        <span className="fold-text-line" key={`line-${index}`}>
          {renderSegment(line || '\u00A0', `segment-line-${index}`, 'line')}
        </span>
      ));
    }

    if (splitBy === 'word') {
      return text.split(/(\s+)/).flatMap((part, index) => {
        if (!part) return [];
        if (/^\s+$/.test(part)) return renderWhitespace(part, `ws-${index}`);
        return renderSegment(part, `segment-word-${segmentIndex}`);
      });
    }

    return Array.from(text).map((char, index) => {
      if (char === '\n') return <br key={`br-${index}`} />;
      return renderSegment(char === ' ' ? '\u00A0' : char, `segment-char-${index}`);
    });
  }, [text, splitBy, hinge, hingeConfig.origin, safePerspective]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const root = rootRef.current;
    if (!root) return undefined;

    const pieces = Array.from(root.querySelectorAll('.fold-text-piece'));
    if (!pieces.length) return undefined;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const activeDuration = reduceMotion ? Math.min(duration, 0.22) : duration;
    const activeStagger = reduceMotion ? Math.min(stagger, 0.02) : stagger;
    const fromVars = {
      opacity: 0,
      rotateX: reduceMotion ? 0 : hingeConfig.rotateX,
      rotateY: reduceMotion ? 0 : hingeConfig.rotateY,
      '--fold-crease': reduceMotion ? 0 : safeCrease,
      transformOrigin: hingeConfig.origin,
      force3D: true
    };
    const toVars = {
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      '--fold-crease': 0,
      duration: activeDuration,
      ease: reduceMotion ? 'power1.out' : ease,
      stagger: activeStagger,
      clearProps: 'willChange'
    };

    const killTimeline = () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      gsap.killTweensOf(pieces);
    };

    const play = repeat => {
      killTimeline();
      timelineRef.current = gsap.timeline({ repeat: repeat ? -1 : 0, repeatDelay: repeat ? 0.75 : 0 });
      timelineRef.current.fromTo(pieces, fromVars, toVars);
      return timelineRef.current;
    };

    let scrollTrigger;
    let hoverHandler;

    if (trigger === 'hover') {
      gsap.set(pieces, { opacity: 1, rotateX: 0, rotateY: 0, '--fold-crease': 0, transformOrigin: hingeConfig.origin });
      hoverHandler = () => play(false);
      root.addEventListener('mouseenter', hoverHandler);
    } else if (trigger === 'scroll') {
      gsap.set(pieces, fromVars);
      scrollTrigger = ScrollTrigger.create({
        trigger: root,
        start: 'top 82%',
        once: true,
        onEnter: () => play(false)
      });
    } else if (trigger === 'loop') {
      play(true);
    } else {
      play(false);
    }

    return () => {
      if (hoverHandler) root.removeEventListener('mouseenter', hoverHandler);
      scrollTrigger?.kill();
      killTimeline();
    };
  }, [
    text,
    splitBy,
    hinge,
    duration,
    stagger,
    ease,
    perspective,
    safeCrease,
    trigger,
    hingeConfig.origin,
    hingeConfig.rotateX,
    hingeConfig.rotateY
  ]);

  const rootStyle = {
    '--fold-text-font-size': typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    '--fold-text-font-weight': fontWeight,
    '--fold-text-color': color,
    ...style
  };

  return (
    <span ref={rootRef} className={`fold-text ${className}`.trim()} style={rootStyle}>
      <span className="fold-text-sr-only">{text}</span>
      <span className="fold-text-visual" aria-hidden="true">
        {segments}
      </span>
    </span>
  );
};

export default FoldText;

```

### Component CSS
```css
.fold-text {
  display: inline-block;
  color: var(--fold-text-color, currentColor);
  font-size: var(--fold-text-font-size, inherit);
  font-weight: var(--fold-text-font-weight, inherit);
  line-height: 0.95;
  letter-spacing: -0.04em;
  white-space: pre-wrap;
  user-select: text;
}

.fold-text-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.fold-text-visual {
  display: inline;
}

.fold-text-line {
  display: block;
}

.fold-text-whitespace {
  display: inline;
}

.fold-text-segment {
  display: inline-block;
  line-height: inherit;
  perspective: var(--fold-perspective, 700px);
  transform-style: preserve-3d;
  vertical-align: baseline;
}

.fold-text-segment[data-fold-split='line'] {
  display: block;
}

.fold-text-piece {
  position: relative;
  display: inline-block;
  color: inherit;
  line-height: inherit;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform, opacity;
}

.fold-text-piece::after {
  content: '';
  position: absolute;
  inset: -0.08em -0.02em;
  pointer-events: none;
  opacity: var(--fold-crease, 0);
  mix-blend-mode: multiply;
  border-radius: 0.08em;
}

.fold-text-piece[data-fold-hinge='top']::after {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);
}

.fold-text-piece[data-fold-hinge='bottom']::after {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);
}

.fold-text-piece[data-fold-hinge='left']::after {
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);
}

.fold-text-piece[data-fold-hinge='right']::after {
  background: linear-gradient(270deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);
}

@media (prefers-reduced-motion: reduce) {
  .fold-text-piece {
    transform: none !important;
  }

  .fold-text-piece::after {
    opacity: 0 !important;
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


- so now all the texts and one image is done after lil more scroll not complete scroll i am still on the blue part i want that two folders slay and serve to just pop up animation and nothing big or crazy just pop from below or top or one from below and one from top together anything is fine like that 

- right after that folder animation i want that notes reminder thing and i have added that image in the folder its a screenshot of just the notes and that yellow background and that logo without the remindr or anything written on it so what i want is you to first either add that screenshot image or if you can replicate it one to one you can do it and then write reminder on it the reminder text and then i want you to add an animation for the texts below but make sure you use my written lines there and after that animation can you add some animation on that reminder such that how it is in the image right now a select text getting highlighted type like that i want it to happen after the animation below and make sure you do the animation properly so this animation works in real life clicking or tick box so make sure you add that and that you properly align it with the box of it in and that it should not go out of the box or anything of that sort 

## Integrate the <SpringCheck /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: SpringCheck
### Variant: JavaScript + CSS
### Dependencies: motion @hugeicons/core-free-icons

---

### Usage Example
```jsx
import SpringCheck from './SpringCheck';

<SpringCheck
  label="Ship the build"
  defaultChecked={false}
  onChange={checked => console.log(checked)}
  color="#ffffff"
  fillColor="#ffffff"
  checkColor="#0b0b0f"
  boxSize={28}
  boxRadius={9}
  fontSize={18}
  bounce={0.2}
  strikeLag={0.12}
  doneOpacity={0.42}
  strike="left"
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | ReactNode | "Ship the build" | The words beside the box; the strike-through is exactly their width. |
| checked | boolean | undefined | Controlled state. A change from outside animates on the spring. |
| defaultChecked | boolean | false | Initial state when uncontrolled. |
| onChange | (checked: boolean) => void | - | Called on every toggle. |
| disabled | boolean | false | Dims the row and ignores input. |
| color | string | "#ffffff" | Ink: the label, the ring, the rule and the focus outline. |
| fillColor | string | "#ffffff" | The fill that swells out of the box centre. |
| checkColor | string | "#0b0b0f" | Stroke of the tick drawn over the fill. |
| boxSize | number | 28 | Box side in pixels; ring, gap and row height derive from it. |
| boxRadius | number | 9 | Box corner radius in pixels; half the size makes a circle. |
| fontSize | number | 18 | Label size in pixels; the rule thickness derives from it. |
| bounce | number | 0.2 | How far the fill swells past full. 0 arrives dead, 0.5 rebounds twice. |
| strikeLag | number | 0.12 | Where on the spring the rule starts: 0 wipes with the fill, 0.4 waits for the tick. |
| doneOpacity | number | 0.42 | How much ink the words keep once checked. |
| strike | "left" | "center" | "right" | "none" | "left" | Where the strike-through wipes from, or no rule at all. |
| ariaLabel | string | - | Accessible name when the label is not text. |
| className | string | "" | Extra classes for the row. |

### Full Component Source
```jsx
'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { Tick02Icon } from '@hugeicons/core-free-icons';

import './SpringCheck.css';

const VISUAL_DURATION = 0.2;
const RULE_END = 0.84;
const SWELL = 0.35;
const TICK_PATH = String(Tick02Icon[0][1].d);
const ORIGIN = { left: 'left center', center: 'center', right: 'right center', none: 'left center' };

const clamp01 = value => Math.min(1, Math.max(0, value));
const zetaOf = bounce => (bounce <= 0 ? 1 : -Math.log(bounce) / Math.sqrt(Math.PI ** 2 + Math.log(bounce) ** 2));

const readings = (t, doneOpacity, strikeLag) => {
  const held = clamp01(t);
  return {
    fill: `scale(${Math.max(t, 0)})`,
    box: `scale(${1 + SWELL * Math.max(0, t - 1)})`,
    tick: 1 - held,
    word: 1 - (1 - doneOpacity) * held,
    rule: `scaleX(${clamp01((held - strikeLag) / (RULE_END - strikeLag))})`
  };
};

export default function SpringCheck({
  label = 'Ship the build',
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  color = '#ffffff',
  fillColor = '#ffffff',
  checkColor = '#0b0b0f',
  boxSize = 28,
  boxRadius = 9,
  fontSize = 18,
  bounce = 0.2,
  strikeLag = 0.12,
  doneOpacity = 0.42,
  strike = 'left',
  ariaLabel,
  className = ''
}) {
  const controlled = checked !== undefined;
  const [inner, setInner] = useState(defaultChecked);
  const on = controlled ? checked : inner;
  const reduce = useReducedMotion();

  const t = useMotionValue(on ? 1 : 0);
  const viaPointer = useRef(false);
  const instant = useRef(false);
  const rowRef = useRef(null);
  const boxRef = useRef(null);
  const fillRef = useRef(null);
  const tickRef = useRef(null);
  const wordRef = useRef(null);
  const ruleRef = useRef(null);
  const cfg = useRef({ doneOpacity, strikeLag });
  cfg.current = { doneOpacity, strikeLag };

  const write = value => {
    const r = readings(value, cfg.current.doneOpacity, cfg.current.strikeLag);
    if (fillRef.current) fillRef.current.style.transform = r.fill;
    if (boxRef.current) boxRef.current.style.transform = r.box;
    if (tickRef.current) tickRef.current.style.strokeDashoffset = r.tick;
    if (wordRef.current) wordRef.current.style.opacity = r.word;
    if (ruleRef.current) ruleRef.current.style.transform = r.rule;
  };
  useMotionValueEvent(t, 'change', write);
  useLayoutEffect(() => {
    write(t.get());
  });

  useEffect(() => {
    const target = on ? 1 : 0;
    if (reduce || instant.current) {
      instant.current = false;
      t.jump(target);
      return undefined;
    }
    if (t.get() === target && t.getVelocity() === 0) return undefined;
    const controls = animate(t, target, {
      type: 'spring',
      visualDuration: VISUAL_DURATION,
      bounce: 1 - zetaOf(bounce)
    });
    return () => controls.stop();
  }, [on, reduce, bounce, t]);

  const handlePointerDown = e => {
    if (e.button !== 0 || disabled) return;
    viaPointer.current = true;
    if (!reduce && rowRef.current) rowRef.current.dataset.pressed = '';
  };
  const handlePointerUp = () => {
    if (rowRef.current) delete rowRef.current.dataset.pressed;
  };
  const handlePointerCancel = () => {
    viaPointer.current = false;
    handlePointerUp();
  };
  const toggle = () => {
    if (disabled) return;
    instant.current = !viaPointer.current;
    viaPointer.current = false;
    const next = !on;
    if (!controlled) setInner(next);
    onChange?.(next);
  };

  const r = readings(t.get(), doneOpacity, strikeLag);
  const ring = boxSize >= 24 ? 2 : 1.5;
  const gap = Math.min(16, Math.max(8, Math.round(boxSize * 0.43)));
  const ruleHeight = Math.max(1.5, Math.round(fontSize / 6) / 2);

  return (
    <button
      ref={rowRef}
      type="button"
      role="checkbox"
      aria-checked={on}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`spring-check${className ? ` ${className}` : ''}`}
      style={{
        '--sc-ink': color,
        '--sc-fill': fillColor,
        '--sc-check': checkColor,
        '--sc-box': `${boxSize}px`,
        '--sc-radius': `${boxRadius}px`,
        '--sc-font': `${fontSize}px`,
        '--sc-ring': `${ring}px`,
        '--sc-gap': `${gap}px`,
        '--sc-row': `${Math.max(44, boxSize + 16)}px`,
        '--sc-rule': `${ruleHeight}px`,
        '--sc-origin': ORIGIN[strike] || ORIGIN.left
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerCancel}
      onClick={toggle}
    >
      <span className="spring-check__press">
        <span ref={boxRef} className="spring-check__box" style={{ transform: r.box }}>
          <span className="spring-check__ring" aria-hidden="true" />
          <span ref={fillRef} className="spring-check__fill" style={{ transform: r.fill }} />
          <svg className="spring-check__tick" viewBox="0 0 24 24" aria-hidden="true">
            <path ref={tickRef} d={TICK_PATH} pathLength={1} strokeDasharray={1} style={{ strokeDashoffset: r.tick }} />
          </svg>
        </span>
      </span>
      <span className="spring-check__label">
        <span ref={wordRef} className="spring-check__word" style={{ opacity: r.word }}>
          {label}
        </span>
        {strike !== 'none' ? (
          <span ref={ruleRef} className="spring-check__rule" aria-hidden="true" style={{ transform: r.rule }} />
        ) : null}
      </span>
    </button>
  );
}

```

### Component CSS
```css
.spring-check {
  --sc-ink: #ffffff;
  --sc-fill: #ffffff;
  --sc-check: #0b0b0f;
  --sc-box: 28px;
  --sc-radius: 9px;
  --sc-font: 18px;
  --sc-ring: 2px;
  --sc-gap: 12px;
  --sc-row: 44px;
  --sc-rule: 1.5px;
  --sc-origin: left center;
  --sc-ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  display: inline-flex;
  align-items: center;
  gap: var(--sc-gap);
  min-height: var(--sc-row);
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: var(--sc-ink);
  font-family: inherit;
  font-size: var(--sc-font);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.01em;
  text-align: left;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  outline: none;
}

.spring-check:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spring-check__press {
  flex: none;
  width: var(--sc-box);
  height: var(--sc-box);
  border-radius: var(--sc-radius);
  transition: transform 160ms var(--sc-ease-out);
}

.spring-check[data-pressed] .spring-check__press {
  transform: scale(0.95);
}

.spring-check:focus-visible .spring-check__press {
  outline: 2px solid color-mix(in srgb, var(--sc-ink) 45%, transparent);
  outline-offset: 3px;
}

.spring-check__box {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  overflow: hidden;
  transform-origin: center;
}

.spring-check__ring {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 var(--sc-ring) var(--sc-ink);
  opacity: 0.28;
  transition: opacity 120ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .spring-check:not(:disabled):hover .spring-check__ring {
    opacity: 0.5;
  }
}

.spring-check__fill {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--sc-fill);
  transform-origin: center;
}

.spring-check__tick {
  position: relative;
  width: 68%;
  height: 68%;
  overflow: visible;
  fill: none;
  stroke: var(--sc-check);
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.spring-check__label {
  position: relative;
  display: inline-block;
}

.spring-check__word {
  display: inline-block;
}

.spring-check__rule {
  position: absolute;
  left: 0;
  right: 0;
  top: 46%;
  height: var(--sc-rule);
  border-radius: 2px;
  background: currentColor;
  transform-origin: var(--sc-origin);
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .spring-check__press {
    transition: none;
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


- now as i scroll down below again the heading comes " stalk us on Instagram or just stock up " so this is a heading so i want it the same way that blur text animation on the text and that yellow highlight background should appear as well on the Instagram text from left to right from i to m as how its given here and in a smooth motion and make sure you see where it starts as Instagram text is captialised and is coming little outside the box so make sure you copy that style properly.

- below those images are just placeholders as what i am planning here is that those will be where my reels will come from my insta account promoting our insta part as well and how it works is that it will have a live panorama effect carousel and that it will have that reel playing ( now you tell me that just sending you the link of the reel is enough or should i have to download the reel and add it in this or should i just attach the link to it as the account is open so you can fetch and play it as i want the reel to start playing as it scrolls and it can be reel or our post anything but yeah and that when i hover or click on it , it should open insta out of it is my plan so we can embed the link to those reels and its link 
below ill tell the reels i have downloaded and its link as well
coatz blueprint reel ( https://www.instagram.com/reel/DbQQiLWvhz6/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA== )
whats in my bag ( https://www.instagram.com/reel/DbnTNyvPFjT/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA== )
conveyor belt ( https://www.instagram.com/reel/DcGyEwcPpkf/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA== )
desk arrange ( https://www.instagram.com/reel/DcofLtLvkcu/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA== )
your breakfast looks like ( https://www.instagram.com/reel/DdCN1B-vY_B/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA== )
a mind too full ( https://www.instagram.com/reel/DdnlMhGtfhS/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA== )

so these are the reels for now you just take it from the folder and rotate it in the carousel animation and make sure when i click it should open Instagram type 

below is the code for the carousle animation for the reels

## Integrate the <CircularCarousel /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: CircularCarousel
### Variant: JavaScript + CSS


---

### Usage Example
```jsx
import CircularCarousel from './CircularCarousel';

const items = [
  { src: '/images/valley.jpg', alt: 'Mist drifting through a valley', title: 'Valley', subtitle: 'Landscape' },
  { src: '/images/portrait.jpg', alt: 'A studio portrait', title: 'Portrait', subtitle: 'Studio' },
  { src: '/images/towers.jpg', alt: 'Glass towers from street level', title: 'Towers', subtitle: 'Architecture' }
];

<div style={{ width: '100%', height: '560px', position: 'relative' }}>
  <CircularCarousel
    items={items}
    preset="panorama"
    intro="spin"
    cardWidth={220}
    aspectRatio={0.75}
    speed={8}
    captions
    tilt={0}
    perspective={1800}
    momentum={0.51}
    fadeColor="#0e63f1"
/>
</div>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | Array<{ src: string; alt?: string; title?: string; subtitle?: string }> | 10 sample photos | Images placed around the ring. The alt text is announced to screen readers, the title and optional subtitle are shown by captions. |
| preset | 'cylinder' | 'orbit' | 'wheel' | 'panorama' | 'cylinder' | Shape of the ring. Cylinder faces the cards outward, orbit keeps every card turned toward you, wheel spins top to bottom, and panorama puts the camera inside the ring. |
| intro | 'assemble' | 'rise' | 'spin' | 'none' | 'rise' | Entrance once the images load. Assemble glides the cards in from a wider ring, rise slides them in one by one from the edge of the frame, and spin lands a fast turn. |
| cardWidth | number | 220 | Card width in px. The whole ring scales down to fit its container when it needs to. |
| aspectRatio | number | 1 | Card width divided by its height. Images are cropped to fill the card. |
| gap | number | 25 | Space between neighbouring cards, in px. |
| curve | number | from preset | How far the cards bend to follow the ring, from flat at 0 to fully wrapped at 1. Ignored by orbit. |
| tilt | number | from preset | Camera angle in degrees. Negative values look down onto the ring. |
| perspective | number | from preset | Camera distance in px. Lower values exaggerate depth. Panorama sets its own, since the camera sits at the centre. |
| autoplay | 'drift' | 'step' | 'off' | 'drift' | Drift turns the ring continuously, step moves one card at a time and settles on it, off only moves when you do. |
| speed | number | 14 | Drift speed in degrees per second. |
| interval | number | 3 | Seconds between moves in step mode. |
| direction | 'left' | 'right' | 'left' | Which way the front cards travel. A flick changes it to the way you threw the ring. On the wheel, left means up. |
| draggable | boolean | true | Lets you grab and throw the ring with a mouse, finger or horizontal trackpad scroll. |
| momentum | number | 0.6 | How long a throw keeps gliding before it blends back into the autoplay speed, from 0 to 1. |
| snap | boolean | true | Settles on a card whenever the ring comes to rest. |
| pauseOnHover | boolean | true | Eases the ring to a stop while the pointer is over it. |
| focusOnClick | boolean | true | Clicking a card turns it to the front. |
| parallax | number | 0.3 | How much the camera leans toward the pointer, from 0 to 1. |
| stretch | number | 0.5 | How much the ring swells outward when it spins fast, from 0 to 1. |
| depthFade | number | 0.55 | How strongly cards fade into fadeColor as they turn away, from 0 to 1. |
| fadeColor | string | '#000000' | Color distant cards fade toward. Match it to the background behind the carousel. |
| innerShade | number | 0.6 | Brightness of the inside faces seen through the back of the ring, from 0 to 1. |
| cornerRadius | number | 12 | Corner radius of the cards, in px. |
| captions | boolean | false | Shows the front card title, subtitle and position under the ring. |
| onChange | (index: number) => void | - | Called when a different card reaches the front. |
| onItemClick | (item, index: number) => void | - | Called when a card is clicked, or when Enter is pressed on the carousel. |
| className | string | '' | Extra classes on the container. |
| style | CSSProperties | - | Inline styles on the container. |

### Full Component Source
```jsx
'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import './CircularCarousel.css';

const photo = id => `https://images.unsplash.com/${id}?w=900&q=80&auto=format&fit=max&sat=-100`;

const DEFAULT_ITEMS = [
  {
    src: photo('photo-1506744038136-46273834b3fb'),
    alt: 'Mist drifting through a mountain valley',
    title: 'Valley',
    subtitle: 'Landscape'
  },
  {
    src: photo('photo-1524504388940-b1c1722653e1'),
    alt: 'A woman with long hair in soft studio light',
    title: 'Portrait',
    subtitle: 'Studio'
  },
  {
    src: photo('photo-1486406146926-c627a92ad1ab'),
    alt: 'Glass towers seen from street level',
    title: 'Towers',
    subtitle: 'Architecture'
  },
  {
    src: photo('photo-1502680390469-be75c86b636f'),
    alt: 'A surfer carving inside a breaking wave',
    title: 'Swell',
    subtitle: 'Ocean'
  },
  {
    src: photo('photo-1487958449943-2429e8be8625'),
    alt: 'An angular white building against the sky',
    title: 'Facade',
    subtitle: 'Architecture'
  },
  {
    src: photo('photo-1509631179647-0177331693ae'),
    alt: 'A model in striped trousers leaning on a wall',
    title: 'Pose',
    subtitle: 'Editorial'
  },
  {
    src: photo('photo-1519681393784-d120267933ba'),
    alt: 'The Milky Way above snowy peaks',
    title: 'Night',
    subtitle: 'Sky'
  },
  {
    src: photo('photo-1485968579580-b6d095142e6e'),
    alt: 'A woman in a long coat on a city street',
    title: 'Street',
    subtitle: 'Editorial'
  },
  {
    src: photo('photo-1493246507139-91e8fad9978e'),
    alt: 'Mountains mirrored in a still lake',
    title: 'Mirror',
    subtitle: 'Landscape'
  },
  {
    src: photo('photo-1511818966892-d7d671e672a2'),
    alt: 'A glass skyscraper under a cloudy sky',
    title: 'Glass',
    subtitle: 'Architecture'
  }
];

const PRESETS = {
  cylinder: {
    axis: 'y',
    tilt: -5,
    perspective: 2500,
    curve: 1,
    spread: 1,
    inward: false,
    billboard: false,
    backfaces: true,
    window: 0
  },
  orbit: {
    axis: 'y',
    tilt: -16,
    perspective: 1500,
    curve: 0,
    spread: 1.45,
    inward: false,
    billboard: true,
    backfaces: false,
    window: 0
  },
  wheel: {
    axis: 'x',
    tilt: 0,
    perspective: 1800,
    curve: 0,
    spread: 1,
    inward: false,
    billboard: false,
    backfaces: true,
    window: 1.7
  },
  panorama: {
    axis: 'y',
    tilt: 0,
    perspective: 0,
    curve: 1,
    spread: 1,
    inward: true,
    billboard: false,
    backfaces: false,
    window: 0
  }
};

const INTRO_LENGTH = { assemble: 1500, rise: 1400, spin: 1800, none: 0 };
const TILES = 8;
const OVERLAP = 2.5;
const DRAG_THRESHOLD = 5;
const SPRING = 118;
const SETTLE_SPEED = 9;
const CAPTION_SPACE = 76;
const TO_RAD = Math.PI / 180;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const wrap = degrees => ((((degrees + 180) % 360) + 360) % 360) - 180;
const easeOut = t => 1 - Math.pow(1 - t, 4);
const easeOutQuint = t => 1 - Math.pow(1 - t, 5);

const rotateX = (p, degrees) => {
  const r = degrees * TO_RAD;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
};

const rotateY = (p, degrees) => {
  const r = degrees * TO_RAD;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c];
};

const Digits = ({ value }) => (
  <span className="circular-carousel__digits">
    {String(value)
      .padStart(2, '0')
      .split('')
      .map((digit, index) => (
        <span key={index} className="circular-carousel__digit">
          <span className="circular-carousel__reel" style={{ transform: `translateY(${-Number(digit) * 10}%)` }}>
            {'0123456789'.split('').map(n => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
  </span>
);

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return undefined;
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);
  return reduced;
};

const CircularCarousel = ({
  items = DEFAULT_ITEMS,
  preset = 'cylinder',
  intro = 'rise',
  cardWidth = 220,
  aspectRatio = 1,
  gap = 25,
  curve,
  tilt,
  perspective,
  autoplay = 'drift',
  speed = 14,
  interval = 3,
  direction = 'left',
  draggable = true,
  momentum = 0.6,
  snap = true,
  pauseOnHover = true,
  focusOnClick = true,
  parallax = 0.3,
  stretch = 0.5,
  depthFade = 0.55,
  fadeColor = '#000000',
  innerShade = 0.6,
  cornerRadius = 12,
  captions = false,
  onChange,
  onItemClick,
  className = '',
  style
}) => {
  const list = items && items.length ? items : DEFAULT_ITEMS;
  const count = list.length;
  const shape = PRESETS[preset] ? preset : 'cylinder';
  const layout = PRESETS[shape];
  const axis = layout.axis;
  const tiltValue = tilt ?? layout.tilt;
  const curveValue = layout.billboard ? 0 : clamp(curve ?? layout.curve, 0, 1);
  const reduced = usePrefersReducedMotion();

  const cardW = Math.max(40, cardWidth);
  const cardH = cardW / clamp(aspectRatio, 0.2, 5);
  const along = axis === 'x' ? cardH : cardW;
  const step = 360 / count;

  const radius = useMemo(() => {
    const n = Math.max(count, 3);
    const pitch = (along + gap) * layout.spread;
    const chord = pitch / (2 * Math.sin(Math.PI / n));
    const arc = (n * pitch) / (2 * Math.PI);
    return Math.max(chord + (arc - chord) * curveValue, along * 0.6);
  }, [count, along, gap, curveValue, layout.spread]);

  const tiles = useMemo(() => {
    const total = curveValue > 0.001 ? TILES : 1;
    const length = along / total;
    const bend = curveValue > 0.001 ? radius / curveValue : 0;
    return Array.from({ length: total }, (_, index) => {
      const start = index * length - (index > 0 ? OVERLAP / 2 : 0);
      const end = (index + 1) * length + (index < total - 1 ? OVERLAP / 2 : 0);
      const center = (start + end) / 2 - along / 2;
      const alpha = bend ? center / bend : 0;
      const shift = bend ? bend * Math.sin(alpha) : center;
      const sink = bend ? bend * (1 - Math.cos(alpha)) : 0;
      const depth = layout.inward ? sink : -sink;
      const turn = ((layout.inward ? -alpha : alpha) * 180) / Math.PI;
      const move =
        axis === 'x'
          ? `translate3d(0px, ${shift}px, ${depth}px) rotateX(${-turn}deg)`
          : `translate3d(${shift}px, 0px, ${depth}px) rotateY(${turn}deg)`;
      return { index, total, start, end, size: end - start, move };
    });
  }, [along, axis, curveValue, layout.inward, radius]);

  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const cameraRef = useRef(null);
  const ringRef = useRef(null);
  const cardRefs = useRef([]);
  const wakeRef = useRef(() => {});
  const measureRef = useRef(() => {});
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const readyRef = useRef(false);
  readyRef.current = ready;

  const stateRef = useRef({
    angle: 0,
    velocity: 0,
    target: null,
    dir: 0,
    press: null,
    drag: false,
    hover: false,
    pointer: { inside: false, x: 0, y: 0 },
    yaw: 0,
    pitch: 0,
    intro: null,
    introDone: false,
    holdUntil: 0,
    stepAt: 0,
    suppressClick: false,
    wheelTimer: 0,
    fit: 1,
    shift: 0,
    drop: 0,
    last: 0
  });

  const settings = {
    count,
    step,
    radius,
    layout,
    axis,
    tilt: tiltValue,
    perspective: layout.inward ? radius : (perspective ?? layout.perspective),
    cardW,
    cardH,
    intro: reduced ? 'none' : intro in INTRO_LENGTH ? intro : 'rise',
    autoplay: reduced ? 'off' : autoplay,
    speed,
    interval: Math.max(0.5, interval),
    draggable,
    momentum: clamp(momentum, 0, 1),
    snap,
    pauseOnHover,
    parallax: reduced ? 0 : clamp(parallax, 0, 1),
    stretch: reduced ? 0 : clamp(stretch, 0, 1),
    depthFade: clamp(depthFade, 0, 1),
    captions,
    reduced
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const dragSign = layout.inward ? -1 : 1;
  const directionSign = (direction === 'right' ? 1 : -1) * dragSign;

  useEffect(() => {
    stateRef.current.dir = directionSign;
    wakeRef.current();
  }, [directionSign]);

  const sourcesKey = list.map(item => item.src).join('|');

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    const sources = sourcesKey.split('|').slice(0, 12);
    const load = src =>
      new Promise(resolve => {
        const image = new Image();
        image.decoding = 'async';
        image.onload = () => (image.decode ? image.decode().then(resolve, resolve) : resolve());
        image.onerror = resolve;
        image.src = src;
      });
    const timeout = new Promise(resolve => setTimeout(resolve, 2400));
    Promise.race([Promise.all(sources.map(load)), timeout]).then(() => {
      if (cancelled) return;
      const state = stateRef.current;
      state.introDone = false;
      state.intro = null;
      setReady(true);
      wakeRef.current();
    });
    return () => {
      cancelled = true;
    };
  }, [sourcesKey]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const camera = cameraRef.current;
    const ring = ringRef.current;
    if (!root || !stage || !camera || !ring) return undefined;
    const state = stateRef.current;
    let raf = 0;
    let visible = true;

    const nearest = angle => Math.round(angle / settingsRef.current.step) * settingsRef.current.step;

    const measure = () => {
      const s = settingsRef.current;
      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const room = s.captions ? CAPTION_SPACE : 0;
      const width = rect.width * 0.94;
      const height = (rect.height - room) * 0.92;
      const P = s.perspective;
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      if (s.layout.inward) {
        minX = -width / 2;
        maxX = width / 2;
        minY = -s.cardH / 2;
        maxY = s.cardH / 2;
      } else {
        const corners = [
          [-s.cardW / 2, -s.cardH / 2],
          [s.cardW / 2, -s.cardH / 2],
          [-s.cardW / 2, s.cardH / 2],
          [s.cardW / 2, s.cardH / 2]
        ];
        const limit = s.layout.window ? s.layout.window * s.step : 180;
        for (let a = -limit; a <= limit; a += limit / 24) {
          for (const [cx, cy] of corners) {
            let p;
            if (s.axis === 'x') {
              p = rotateX([cx, cy, s.radius], -a);
              p = [p[0], p[1], p[2] - s.radius];
              p = rotateY(p, s.tilt);
            } else if (s.layout.billboard) {
              const c = rotateY([0, 0, s.radius], a);
              p = [c[0] + cx, cy, c[2] - s.radius];
              p = rotateX(p, s.tilt);
            } else {
              p = rotateY([cx, cy, s.radius], a);
              p = [p[0], p[1], p[2] - s.radius];
              p = rotateX(p, s.tilt);
            }
            if (p[2] >= P * 0.95) continue;
            const k = P / (P - p[2]);
            minX = Math.min(minX, p[0] * k);
            maxX = Math.max(maxX, p[0] * k);
            minY = Math.min(minY, p[1] * k);
            maxY = Math.max(maxY, p[1] * k);
          }
        }
      }
      const spanX = Math.max(maxX - minX, 1);
      const spanY = Math.max(maxY - minY, 1);
      const fit = Math.min(1, width / spanX, height / spanY);
      state.fit = fit;
      state.shift = -((minY + maxY) / 2) * fit - room / 2;
      state.drop = s.axis === 'x' ? (rect.width / fit) * 0.55 + s.cardW : (rect.height / fit) * 0.55 + s.cardH;
      stage.style.perspective = `${P}px`;
      stage.style.transform = `translate3d(0, ${state.shift}px, 0) scale(${fit})`;
    };
    measureRef.current = measure;

    const introCard = (elapsed, landing) => {
      if (!state.intro) return { radius: 1, lift: 0 };
      const type = state.intro.type;
      const reach = Math.abs(wrap(landing + state.angle));
      if (type === 'assemble') {
        const delay = (reach / 180) * 420;
        const p = easeOut(clamp((elapsed - delay) / 1080, 0, 1));
        return { radius: 1 + 0.6 * (1 - p), lift: 0 };
      }
      if (type === 'rise') {
        const delay = (reach / 180) * 480;
        const p = easeOutQuint(clamp((elapsed - delay) / 900, 0, 1));
        return { radius: 1, lift: (1 - p) * state.drop };
      }
      if (type === 'spin') {
        const p = easeOut(clamp(elapsed / INTRO_LENGTH.spin, 0, 1));
        return { radius: 1 + 0.28 * (1 - p), lift: 0 };
      }
      return { radius: 1, lift: 0 };
    };

    const advance = (s, dt, now) => {
      if (!state.introDone && readyRef.current) {
        if (!state.intro) {
          if (s.intro === 'none') state.introDone = true;
          else state.intro = { type: s.intro, start: now };
        }
        if (state.intro && now - state.intro.start >= INTRO_LENGTH[state.intro.type]) {
          state.intro = null;
          state.introDone = true;
        }
      }

      const paused = (s.pauseOnHover && state.hover) || state.drag || now < state.holdUntil;
      const cruise = s.autoplay === 'drift' && !paused && !state.intro ? s.speed * state.dir : 0;
      let busy = Boolean(state.intro) || state.drag;

      if (state.drag || state.intro) {
        state.velocity = state.drag ? state.velocity : 0;
      } else if (state.target !== null) {
        let remaining = dt;
        const damping = 2 * Math.sqrt(SPRING);
        while (remaining > 0) {
          const h = Math.min(remaining, 1 / 240);
          const accel = SPRING * (state.target - state.angle) - damping * state.velocity;
          state.velocity += accel * h;
          state.angle += state.velocity * h;
          remaining -= h;
        }
        if (Math.abs(state.target - state.angle) < 0.004 && Math.abs(state.velocity) < 0.03) {
          state.angle = state.target;
          state.velocity = 0;
          state.target = null;
        }
        busy = true;
      } else {
        const tau = 0.18 + s.momentum * 1.5;
        state.velocity += (cruise - state.velocity) * (1 - Math.exp(-dt / tau));
        state.angle += state.velocity * dt;
        if (cruise === 0 && s.snap && Math.abs(state.velocity) < SETTLE_SPEED) {
          state.target = nearest(state.angle);
        }
        busy = busy || cruise !== 0 || Math.abs(state.velocity) > 0.01 || state.target !== null;
      }

      if (s.autoplay === 'step' && !paused && !state.intro && state.introDone) {
        if (!state.stepAt) state.stepAt = now + s.interval * 1000;
        if (now >= state.stepAt) {
          state.target = (state.target ?? nearest(state.angle)) + s.step * state.dir;
          state.stepAt = now + s.interval * 1000;
        }
        busy = true;
      } else {
        state.stepAt = 0;
      }

      if (now < state.holdUntil) busy = true;

      const ease = 1 - Math.exp(-dt / 0.35);
      const aimYaw = state.pointer.inside ? state.pointer.x * s.parallax * 9 : 0;
      const aimPitch = state.pointer.inside ? -state.pointer.y * s.parallax * 6 : 0;
      state.yaw += (aimYaw - state.yaw) * ease;
      state.pitch += (aimPitch - state.pitch) * ease;
      if (Math.abs(aimYaw - state.yaw) > 0.01 || Math.abs(aimPitch - state.pitch) > 0.01) busy = true;

      return busy;
    };

    const render = (s, now) => {
      const elapsed = state.intro ? now - state.intro.start : 0;
      const swell = 1 + s.stretch * 0.12 * Math.min(1, Math.abs(state.velocity) / 420);
      let spinOffset = 0;
      if (state.intro?.type === 'spin') {
        const p = easeOut(clamp(elapsed / INTRO_LENGTH.spin, 0, 1));
        spinOffset = -300 * state.dir * (1 - p);
      } else if (state.intro?.type === 'assemble') {
        const p = easeOut(clamp(elapsed / INTRO_LENGTH.assemble, 0, 1));
        spinOffset = -32 * state.dir * (1 - p);
      }
      const angle = state.angle + spinOffset;
      const R = s.radius * swell;

      if (s.axis === 'x') {
        camera.style.transform = `translate3d(0, 0, ${-R}px) rotateY(${s.tilt + state.yaw}deg) rotateX(${state.pitch}deg)`;
        ring.style.transform = `rotateX(${-angle}deg)`;
      } else if (s.layout.inward) {
        camera.style.transform = `translate3d(0, 0, ${s.perspective - 1}px) rotateX(${s.tilt + state.pitch}deg) rotateY(${state.yaw}deg)`;
        ring.style.transform = `rotateY(${angle}deg)`;
      } else {
        camera.style.transform = `translate3d(0, 0, ${-R}px) rotateX(${s.tilt + state.pitch}deg) rotateY(${state.yaw}deg)`;
        ring.style.transform = `rotateY(${angle}deg)`;
      }

      for (let index = 0; index < s.count; index++) {
        const card = cardRefs.current[index];
        if (!card) continue;
        const base = index * s.step;
        const mod = introCard(elapsed, base);
        const r = R * mod.radius;
        let transform;
        if (s.axis === 'x') {
          transform = `rotateX(${-base}deg) translateZ(${r}px)`;
        } else if (s.layout.inward) {
          transform = `rotateY(${base}deg) translateZ(${-r}px)`;
        } else {
          transform = `rotateY(${base}deg) translateZ(${r}px)`;
          if (s.layout.billboard) transform += ` rotateY(${-(base + angle)}deg)`;
        }
        if (mod.lift) transform += s.axis === 'x' ? ` translateX(${mod.lift}px)` : ` translateY(${mod.lift}px)`;
        card.style.transform = transform;

        const world = wrap(base + angle);
        const facing = Math.cos(world * TO_RAD);
        if (s.layout.inward) card.style.visibility = Math.abs(world) > 86 ? 'hidden' : '';
        const fade = s.depthFade * Math.pow((1 - facing) / 2, 1.25);
        card.style.setProperty('--cc-depth', fade.toFixed(3));
      }

      const index = ((Math.round(-state.angle / s.step) % s.count) + s.count) % s.count || 0;
      if (index !== activeRef.current) {
        activeRef.current = index;
        setActive(index);
        onChangeRef.current?.(index);
      }
    };

    const frame = now => {
      raf = 0;
      const s = settingsRef.current;
      const dt = state.last ? Math.min((now - state.last) / 1000, 0.05) : 1 / 60;
      state.last = now;
      const busy = advance(s, dt, now);
      render(s, now);
      if (busy && visible && !document.hidden) raf = requestAnimationFrame(frame);
      else state.last = 0;
    };

    const wake = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    wakeRef.current = wake;

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
        state.last = 0;
      } else wake();
    };

    const resize = new ResizeObserver(() => {
      measure();
      wake();
    });
    resize.observe(root);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
      else {
        cancelAnimationFrame(raf);
        raf = 0;
        state.last = 0;
      }
    });
    io.observe(root);

    const onWheel = event => {
      const s = settingsRef.current;
      if (!s.draggable) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : 0;
      if (!delta) return;
      event.preventDefault();
      const perPixel = 180 / (Math.PI * s.radius * state.fit);
      state.target = null;
      state.angle -= delta * perPixel * (s.layout.inward ? -1 : 1);
      state.velocity = -delta * perPixel * (s.layout.inward ? -1 : 1) * 30;
      state.holdUntil = performance.now() + 1600;
      clearTimeout(state.wheelTimer);
      state.wheelTimer = setTimeout(() => {
        if (settingsRef.current.snap) state.target = nearest(state.angle + state.velocity * 0.12);
        wake();
      }, 140);
      wake();
    };
    root.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('visibilitychange', onVisibility);

    measure();
    render(settingsRef.current, performance.now());
    wake();

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      io.disconnect();
      clearTimeout(state.wheelTimer);
      root.removeEventListener('wheel', onWheel);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useLayoutEffect(() => {
    measureRef.current();
    wakeRef.current();
  }, [radius, cardW, cardH, tiltValue, perspective, preset, captions, count]);

  useEffect(() => {
    wakeRef.current();
  });

  const focusIndex = useCallback(index => {
    const state = stateRef.current;
    const s = settingsRef.current;
    let target = -index * s.step;
    target += 360 * Math.round((state.angle - target) / 360);
    state.target = target;
    state.holdUntil = performance.now() + 2800;
    wakeRef.current();
  }, []);

  const stepBy = useCallback(delta => {
    const state = stateRef.current;
    const s = settingsRef.current;
    const base = state.target ?? Math.round(state.angle / s.step) * s.step;
    state.target = base - delta * s.step * (s.layout.inward ? -1 : 1);
    state.holdUntil = performance.now() + 2800;
    wakeRef.current();
  }, []);

  const updatePointer = event => {
    const rect = rootRef.current.getBoundingClientRect();
    const pointer = stateRef.current.pointer;
    pointer.x = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
    pointer.y = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
  };

  const handlePointerDown = event => {
    const state = stateRef.current;
    state.suppressClick = false;
    if (!draggable || event.button !== 0) return;
    state.press = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      angle: state.angle,
      moved: false,
      origin: 0,
      samples: [{ time: performance.now(), angle: state.angle }]
    };
  };

  const handlePointerMove = event => {
    const state = stateRef.current;
    if (event.pointerType === 'mouse') {
      state.pointer.inside = true;
      updatePointer(event);
    }
    const press = state.press;
    if (!press || press.id !== event.pointerId) {
      wakeRef.current();
      return;
    }
    const s = settingsRef.current;
    const delta = s.axis === 'x' ? event.clientY - press.y : event.clientX - press.x;
    const cross = s.axis === 'x' ? event.clientX - press.x : event.clientY - press.y;
    if (!press.moved) {
      if (Math.abs(delta) < DRAG_THRESHOLD) return;
      if (Math.abs(cross) > Math.abs(delta) * 1.2 && event.pointerType !== 'mouse') {
        state.press = null;
        return;
      }
      press.moved = true;
      press.origin = delta;
      state.drag = true;
      state.target = null;
      state.velocity = 0;
      setDragging(true);
      try {
        rootRef.current.setPointerCapture(event.pointerId);
      } catch {}
    }
    const perPixel = 180 / (Math.PI * s.radius * state.fit);
    state.angle = press.angle + (delta - press.origin) * perPixel * (s.layout.inward ? -1 : 1);
    const now = performance.now();
    press.samples.push({ time: now, angle: state.angle });
    while (press.samples.length > 2 && now - press.samples[0].time > 110) press.samples.shift();
    wakeRef.current();
  };

  const releasePointer = event => {
    const state = stateRef.current;
    const press = state.press;
    if (!press || press.id !== event.pointerId) return;
    state.press = null;
    if (!press.moved) return;
    state.drag = false;
    setDragging(false);
    state.suppressClick = true;
    const s = settingsRef.current;
    const first = press.samples[0];
    const last = press.samples[press.samples.length - 1];
    const span = (last.time - first.time) / 1000;
    const velocity = span > 0.008 ? clamp((last.angle - first.angle) / span, -1400, 1400) : 0;
    state.velocity = velocity;
    if (Math.abs(velocity) > 60) state.dir = Math.sign(velocity);
    const coasting = s.autoplay === 'drift' && !(s.pauseOnHover && state.hover && event.pointerType === 'mouse');
    if (s.snap && !coasting) {
      const tau = 0.18 + s.momentum * 1.5;
      state.target = Math.round((state.angle + velocity * tau * 0.55) / s.step) * s.step;
    }
    wakeRef.current();
  };

  const handlePointerEnter = event => {
    if (event.pointerType !== 'mouse') return;
    stateRef.current.hover = true;
    wakeRef.current();
  };

  const handlePointerLeave = event => {
    const state = stateRef.current;
    if (event.pointerType === 'mouse') {
      state.hover = false;
      state.pointer.inside = false;
    }
    wakeRef.current();
  };

  const handleClick = event => {
    const state = stateRef.current;
    if (state.suppressClick) {
      state.suppressClick = false;
      return;
    }
    const card = event.target.closest?.('[data-cc-index]');
    if (!card) return;
    const index = Number(card.getAttribute('data-cc-index'));
    if (focusOnClick) focusIndex(index);
    onItemClick?.(list[index], index);
  };

  const handleKeyDown = event => {
    const forward = axis === 'x' ? 'ArrowDown' : 'ArrowRight';
    const backward = axis === 'x' ? 'ArrowUp' : 'ArrowLeft';
    if (event.key === forward) stepBy(1);
    else if (event.key === backward) stepBy(-1);
    else if (event.key === 'Home') focusIndex(0);
    else if (event.key === 'End') focusIndex(count - 1);
    else if (event.key === 'Enter' || event.key === ' ') onItemClick?.(list[activeRef.current], activeRef.current);
    else return;
    event.preventDefault();
  };

  const current = list[active] || list[0];
  const label = current ? current.title || current.alt || `Image ${active + 1}` : '';

  const renderTile = (item, tile, back) => {
    const strip = back ? tile.total - 1 - tile.index : tile.index;
    const first = strip === 0;
    const last = strip === tile.total - 1;
    const r = 'var(--cc-radius)';
    const frameRadius =
      axis === 'x'
        ? `${first ? r : 0} ${first ? r : 0} ${last ? r : 0} ${last ? r : 0}`
        : `${first ? r : 0} ${last ? r : 0} ${last ? r : 0} ${first ? r : 0}`;
    const offset = back ? along - tile.end : tile.start;
    const size = tile.size;
    const box =
      axis === 'x'
        ? { left: -cardW / 2, top: -size / 2, width: cardW, height: size }
        : { left: -size / 2, top: -cardH / 2, width: size, height: cardH };
    const photoStyle =
      axis === 'x'
        ? { left: 0, top: -offset, width: cardW, height: cardH }
        : { left: -offset, top: 0, width: cardW, height: cardH };
    const flip = axis === 'x' ? ' rotateX(180deg)' : ' rotateY(180deg)';
    return (
      <div
        key={`${back ? 'b' : 'f'}${tile.index}`}
        className="circular-carousel__tile"
        style={{ ...box, transform: tile.move + (back ? flip : '') }}
        aria-hidden="true"
      >
        <div
          className="circular-carousel__frame"
          style={{ height: axis === 'x' ? size : cardH, borderRadius: frameRadius }}
        >
          <img
            className="circular-carousel__photo"
            src={item.src}
            alt=""
            draggable={false}
            decoding="async"
            style={photoStyle}
          />
          {back && <div className="circular-carousel__inner" />}
          <div className="circular-carousel__shade" />
        </div>
      </div>
    );
  };

  return (
    <div
      ref={rootRef}
      className={`circular-carousel ${className}`.trim()}
      style={{
        ...style,
        '--cc-fade': fadeColor,
        '--cc-radius': `${Math.max(0, cornerRadius)}px`,
        '--cc-inner': (1 - clamp(innerShade, 0, 1)).toFixed(3)
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image carousel"
      tabIndex={0}
      data-axis={axis}
      data-shape={shape}
      data-ready={ready ? '' : undefined}
      data-draggable={draggable ? '' : undefined}
      data-dragging={dragging ? '' : undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={releasePointer}
      onPointerCancel={releasePointer}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="circular-carousel__view">
        <div ref={stageRef} className="circular-carousel__stage">
          <div ref={cameraRef} className="circular-carousel__camera">
            <div ref={ringRef} className="circular-carousel__ring">
              {list.map((item, index) => (
                <div
                  key={index}
                  ref={element => {
                    cardRefs.current[index] = element;
                  }}
                  className="circular-carousel__card"
                  data-cc-index={index}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${item.title || item.alt || `Image ${index + 1}`}, ${index + 1} of ${count}`}
                >
                  {tiles.map(tile => renderTile(item, tile, false))}
                  {layout.backfaces && tiles.map(tile => renderTile(item, tile, true))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {captions && current && (
        <div className="circular-carousel__caption" aria-hidden="true">
          <span key={active} className="circular-carousel__title">
            {current.title || current.alt}
            {current.subtitle && <span className="circular-carousel__subtitle">{current.subtitle}</span>}
          </span>
          <span className="circular-carousel__count">
            <Digits value={active + 1} />
            <span className="circular-carousel__slash">/</span>
            <span>{String(count).padStart(2, '0')}</span>
          </span>
        </div>
      )}
      <div className="circular-carousel__live" aria-live="polite" aria-atomic="true">
        {`${label}, ${active + 1} of ${count}`}
      </div>
    </div>
  );
};

export default CircularCarousel;

```

### Component CSS
```css
.circular-carousel {
  --cc-fade: #000000;
  --cc-radius: 12px;
  --cc-inner: 0.4;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: none;
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.circular-carousel[data-axis='x'] {
  touch-action: pan-x;
}

.circular-carousel[data-draggable] {
  cursor: grab;
}

.circular-carousel[data-dragging] {
  cursor: grabbing;
}

.circular-carousel:focus-visible {
  box-shadow: inset 0 0 0 2px rgba(128, 128, 140, 0.55);
}

.circular-carousel__view {
  position: absolute;
  inset: 0;
}

.circular-carousel[data-shape='wheel'] .circular-carousel__view {
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000000 18%, #000000 82%, transparent);
  mask-image: linear-gradient(to bottom, transparent, #000000 18%, #000000 82%, transparent);
}

.circular-carousel[data-shape='panorama'] .circular-carousel__view {
  -webkit-mask-image: linear-gradient(to right, transparent, #000000 12%, #000000 88%, transparent);
  mask-image: linear-gradient(to right, transparent, #000000 12%, #000000 88%, transparent);
}

.circular-carousel__stage {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.45s ease;
}

.circular-carousel[data-ready] .circular-carousel__stage {
  opacity: 1;
}

.circular-carousel__camera,
.circular-carousel__ring,
.circular-carousel__card {
  width: 0;
  height: 0;
  transform-style: preserve-3d;
}

.circular-carousel__camera {
  position: relative;
}

.circular-carousel__ring,
.circular-carousel__card {
  position: absolute;
  left: 0;
  top: 0;
}

.circular-carousel__tile {
  position: absolute;
  outline: 1px solid transparent;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.circular-carousel__frame {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  overflow: hidden;
}

.circular-carousel__photo {
  position: absolute;
  display: block;
  max-width: none;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}

.circular-carousel__shade,
.circular-carousel__inner {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.circular-carousel__shade {
  background: var(--cc-fade);
  opacity: var(--cc-depth, 0);
}

.circular-carousel__inner {
  background: #000000;
  opacity: var(--cc-inner);
}

.circular-carousel__caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  color: inherit;
  text-align: center;
  pointer-events: none;
  animation: circular-carousel-reveal 900ms ease both;
}

.circular-carousel__title {
  display: flex;
  max-width: 100%;
  flex-direction: column;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.35;
  animation: circular-carousel-title 520ms cubic-bezier(0.22, 1, 0.36, 1);
}

.circular-carousel__subtitle {
  font-weight: 400;
  opacity: 0.6;
}

.circular-carousel__count {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  opacity: 0.5;
}

.circular-carousel__slash {
  opacity: 0.6;
}

.circular-carousel__digits {
  display: inline-flex;
}

.circular-carousel__digit {
  display: inline-block;
  height: 1em;
  overflow: hidden;
}

.circular-carousel__reel {
  display: flex;
  flex-direction: column;
  transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
}

.circular-carousel__reel > span {
  height: 1em;
}

.circular-carousel__live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@keyframes circular-carousel-title {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes circular-carousel-reveal {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .circular-carousel__stage,
  .circular-carousel__reel {
    transition: none;
  }

  .circular-carousel__caption,
  .circular-carousel__title {
    animation: none;
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


make sure the above carousle is transparent from behind and shows the behind background and should not hide it as this is between different parts of the website


as on the last part of the website the footer of it here 

- again the header " talk snacks with us" is a header so as above and in the complete website how we did the blur text animation for it i want the same and here with the yellow highlight over the with us starting from left to right from with to us it shuld be smooth and at proper rate and time it well with the scroll function of it as well 	

- and after that header without any delay i want all the other texts to come in that type text properly but in this as its footer and no more scrolling so just give all the text fast properly and then the logo of ishayu in the bottom left corner as well i have added ishayu logo image in the folder you can use it and an animation to its appearance but time it with all other text appearing as well and make sure you add that blur thing behind those texts if you see how it is properly 



so this is about it how i want the animation in the websit image to texts everything, here all the heading text should have that blur text animation which code and prompt give in the top and the paragraph text should be or the follow text after heading will have that type text which code is given and i have given code for many animations so use it properly and make sure you replicate on how i want this design to look with all the animations and make sure you sync all of the animation and parts with the scroll timing and it should be properly synced with the scroll affects as well and should be smooth and that all animation should come properly 








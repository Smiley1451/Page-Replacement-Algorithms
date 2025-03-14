interface PageReplacementResult {
  steps: { page: number; frames: number[] }[];
  pageFaults: number;
}

export function fifoPageReplacement(pages: number[], capacity: number): PageReplacementResult {
  const frames: number[] = new Array(capacity).fill(-1);
  let front = 0;
  let pageFaults = 0;
  const steps: { page: number; frames: number[] }[] = [];

  for (const page of pages) {
    const found = frames.includes(page);

    if (!found) {
      frames[front] = page;
      front = (front + 1) % capacity;
      pageFaults++;
    }

    steps.push({ page, frames: [...frames] });
  }

  return { steps, pageFaults };
}

export function lruPageReplacement(pages: number[], capacity: number): PageReplacementResult {
  const frames: number[] = new Array(capacity).fill(-1);
  const usage: number[] = new Array(capacity).fill(0);
  let pageFaults = 0;
  const steps: { page: number; frames: number[] }[] = [];

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const found = frames.indexOf(page);

    if (found === -1) {
      const emptyIndex = frames.indexOf(-1);
      if (emptyIndex !== -1) {
        frames[emptyIndex] = page;
        usage[emptyIndex] = i;
      } else {
        const lruIndex = usage.indexOf(Math.min(...usage));
        frames[lruIndex] = page;
        usage[lruIndex] = i;
      }
      pageFaults++;
    } else {
      usage[found] = i;
    }

    steps.push({ page, frames: [...frames] });
  }

  return { steps, pageFaults };
}


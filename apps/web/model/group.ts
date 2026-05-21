import { BaseError } from "errors";

// Make the secret friend draw
export function drawSecretFriends(members: number[]): Map<number, number> | null {
  if (members.length < 3) {
    throw new BaseError({
      name: "InsufficientMembersError",
      message: "Pelo menos três membros são necessários para realizar o sorteio.",
    });
  }

  let shuffledMembers = shuffleArray(members.slice());

  while (true) {
    const assignments = new Map<number, number>();
    let valid = true;

    for (let i = 0; i < members.length; i++) {
      const giver = members[i];
      const receiver = shuffledMembers[(i + 1) % members.length];

      if (giver === receiver) {
        valid = false;
        break;
      }
      assignments.set(giver, receiver);
    }

    if (valid && isSingleCycle(assignments, members)) {
      return assignments;
    }

    // If the assignments are not valid, reshuffle and try again
    shuffledMembers = shuffleArray(members.slice());
  }
}

function shuffleArray(array: number[]): number[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function isSingleCycle(assignments: Map<number, number>, members: number[]): boolean {
  const start = members[0];
  const visited = new Set<number>();
  let current = start;

  while (!visited.has(current)) {
    visited.add(current);
    const next = assignments.get(current);
    if (next === undefined) return false;
    current = next;
  }

  return current === start && visited.size === members.length;
}

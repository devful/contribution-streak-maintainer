export function logContributionsToday(count: number): void {
  if (count > 0) {
    console.log(`Current contributions today: ${count}`);
  } else {
    console.log("No contributions today.");
  }
}

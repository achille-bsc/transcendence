export function getAngleRad(p1: {x: number, y: number}, p2: {x: number, y: number}){
  // returns the angle between 2 points in radians
  // p1 = {x: 1, y: 2};
  // p2 = {x: 3, y: 4};
  return (Math.atan2(p2.y - p1.y, p2.x - p1.x));
}
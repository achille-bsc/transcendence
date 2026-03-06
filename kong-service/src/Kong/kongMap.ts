/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   kongMap.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jguelen <jguelen@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/30 17:47:17 by abosc             #+#    #+#             */
/*   Updated: 2026/03/10 10:27:39 by jguelen          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { KongMap, Platform }            from "../utils/types";

// Valeurs en dur: kongMaxHeight = 650, kongMaxLength = 1600
// Écart entre plateformes: ~100 pixels
export const MAP: KongMap = {
	"platforms": [
		{
			"id": 1,
			"startX": 50,
			"endX": 700,
			"startY": 450,
			"endY": 480,
			"hasLadder": true,
			"ladderX": 1500,
			fallOnRight: true
		},
		{
			"id": 2,
			"startX": 50,
			"endX": 700,
			"startY": 380,
			"endY": 350,
			"hasLadder": true,
			"ladderX": 1500,
			fallOnRight: false
		},
		{
			"id": 3,
			"startX": 50,
			"endX": 700,
			"startY": 250,
			"endY": 280,
			"hasLadder": true,
			"ladderX": 1500,
			fallOnRight: true
		},
		{
			"id": 4,
			"startX": 50,
			"endX": 700,
			"startY": 180,
			"endY": 150,
			"hasLadder": true,
			"ladderX": 1500,
			fallOnRight: false
		},
		{
			"id": 5,
			"startX": 50,
			"endX": 700,
			"startY": 50,
			"endY": 80,
			"hasLadder": true,
			"ladderX": 1500,
			fallOnRight: true
		}
	],
	"spawnPoint": {
		"x": 600,
		"y": 400
	},
	"goalPoint": {
		"x": 100,
		"y": 75
	}
}


// export function generateKongMap(numFloors: number): KongMap {
//   const platforms: Platform[] = [];
//   const floorHeight = kongMaxHeight / (numFloors + 1);
//   const slopeRatio = 0.05;
 
  
//   for (let i = 0; i < numFloors; i++) {
//     const isEven = i % 2 === 0;
//     const baseY = kongMaxHeight - (i + 1) * floorHeight;
//     const slope = (kongMaxLength - 160) * slopeRatio;
    
//     platforms.push({
//       id: i,
//       startX: 80,
//       endX: kongMaxLength - 80,
//       startY: isEven ? baseY : baseY + slope,
//       endY: isEven ? baseY + slope : baseY,
//       hasLadder: i < numFloors - 1,
//       ladderX: isEven ? kongMaxLength - 120 : 120
//     });
//   }
  
//   if (!platforms[0])
// 	throw new Error("No platforms generated");
//   const spawnPoint = {
//     x: 150,
//     y: platforms[0].startY - 20
//   };

//   const lastPlatform = platforms[platforms.length - 1];
//   if (!lastPlatform)
// 	throw new Error("No last platform found");
//   const goalPoint = {
//     x: kongMaxLength / 2,
//     y: lastPlatform.startY - 50
//   };
  
//   return { platforms, spawnPoint, goalPoint };
// }

export function getPlatformYAtX(platform: Platform, x: number): number {
  const ratio = (x - platform.startX) / (platform.endX - platform.startX);
  return platform.startY + ratio * (platform.endY - platform.startY);
}
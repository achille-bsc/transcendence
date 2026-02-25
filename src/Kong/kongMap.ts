/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   kongMap.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/30 17:47:17 by abosc             #+#    #+#             */
/*   Updated: 2026/01/30 18:14:11 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { kongMaxHeight, kongMaxLength }	from "../utils/const";
import { KongMap, Platform }			from "../utils/types";

export function generateKongMap(numFloors: number): KongMap {
  const platforms: Platform[] = [];
  const floorHeight = kongMaxHeight / (numFloors + 1);
  const slopeRatio = 0.04; // 4% de pente
 
  
  for (let i = 0; i < numFloors; i++) {
    const isEven = i % 2 === 0;
    const baseY = kongMaxHeight - (i + 1) * floorHeight;
    const slope = (kongMaxLength - 160) * slopeRatio;
    
    platforms.push({
      id: i,
      startX: 80,
      endX: kongMaxLength - 80,
      startY: isEven ? baseY : baseY + slope,
      endY: isEven ? baseY + slope : baseY,
      hasLadder: i < numFloors - 1,
      ladderX: isEven ? kongMaxLength - 120 : 120
    });
  }
  
  if (!platforms[0])
	throw new Error("No platforms generated");
  const spawnPoint = {
    x: 150,
    y: platforms[0].startY - 20
  };

  const lastPlatform = platforms[platforms.length - 1];
  if (!lastPlatform)
	throw new Error("No last platform found");
  const goalPoint = {
    x: kongMaxLength / 2,
    y: lastPlatform.startY - 50
  };
  
  return { platforms, spawnPoint, goalPoint };
}

export function getPlatformYAtX(platform: Platform, x: number): number {
  const ratio = (x - platform.startX) / (platform.endX - platform.startX);
  return platform.startY + ratio * (platform.endY - platform.startY);
}
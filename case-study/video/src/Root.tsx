import React from "react";
import { Composition, Folder, Still } from "remotion";
import { CompoundEvolution } from "./compositions/CompoundEvolution";
import { CompoundEvolutionVertical } from "./compositions/CompoundEvolutionVertical";
import { CompoundTeaser } from "./compositions/CompoundTeaser";
import { filmDuration } from "./compositions/Film";
import { CompoundContactSheet, CompoundCover, CompoundEvolutionMap } from "./compositions/Stills";
import { FPS } from "./data/storyboard";

// durationInFrames is derived from SHOT-MANIFEST.json (last end_s × fps) and cross-checked
// against the TransitionSeries arithmetic in filmDuration().
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Film">
        <Composition id="CompoundEvolution" component={CompoundEvolution} durationInFrames={filmDuration("master", FPS)} fps={FPS} width={1920} height={1080} />
        <Composition id="CompoundEvolutionVertical" component={CompoundEvolutionVertical} durationInFrames={filmDuration("vertical", FPS)} fps={FPS} width={1080} height={1920} />
        <Composition id="CompoundTeaser" component={CompoundTeaser} durationInFrames={filmDuration("teaser", FPS)} fps={FPS} width={1920} height={1080} />
      </Folder>
      <Folder name="Stills">
        <Still id="CompoundCover" component={CompoundCover} width={1920} height={1080} />
        <Still id="CompoundContactSheet" component={CompoundContactSheet} width={1920} height={1080} />
        <Still id="CompoundEvolutionMap" component={CompoundEvolutionMap} width={2560} height={1440} />
      </Folder>
    </>
  );
};

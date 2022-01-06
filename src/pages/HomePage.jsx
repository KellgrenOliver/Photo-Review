import React from "react";
import styled from "@emotion/styled";
import HomePageCarousel from "../components/HomePageCarousel";

const TextWrapper = styled.div({
  width: "70vw",
  fontSize: "1.2rem",
  margin: "auto",
  marginTop: "2rem",
  marginBottom: "2rem",
});

const HomePage = () => {
  return (
    <>
      <HomePageCarousel />
      <TextWrapper>
        <p>
          Nature photography is a wide range of photography taken outdoors and
          devoted to displaying natural elements such as landscapes, wildlife,
          plants, and close-ups of natural scenes and textures. Nature
          photography tends to put a stronger emphasis on the aesthetic value of
          the photo than other photography genres, such as photojournalism and
          documentary photography.
        </p>
        <br />
        <p>
          "Nature photography" overlaps the fields of—and is sometimes
          considered an overarching category including -- "wildlife
          photography," "landscape photography," and "garden photography".
        </p>
        <br />
        <p>
          Nature photographs are published in scientific, travel and cultural
          magazines such as National Geographic Magazine, National Wildlife
          Magazine and Audubon Magazine or other more specific magazines such as
          Outdoor Photographer and Nature's Best Photography. Well known nature
          photographers include Ansel Adams, Eliot Porter, Frans Lanting, Galen
          Rowell, and Art Wolfe.
        </p>
        <br />
        <p>
          Wildlife photography is all about capturing animals in their natural
          habitats. The animals are often photographed in action, such as
          eating, fighting, or in flight. Alternatively, more static portraits
          may be used to show detail of the animal or to depict it in its
          environment. Captive or controlled animals are often photographed
          instead of true wild specimens, although it is arguable as to whether
          this constitutes true wildlife photography.
        </p>
        <br />
        <p>
          The world's largest photography organizations, the Photographic
          Society of America, the Fédération Internationale de l'Art
          Photographique and the Royal Photographic Society have agreed on a
          definition for nature and wildlife photography that will be applied to
          photography competitions. The techniques of wildlife photography
          differ greatly from those used in landscape photography. For example,
          in wildlife photography wide apertures are used to achieve a fast
          shutter speed, freeze the subject's motion, and blur the backgrounds,
          while landscape photographers prefer small apertures. Wildlife is also
          usually shot with long telephoto lenses from a great distance; the use
          of such telephoto lenses frequently necessitates the use of a tripod
          (since the longer the lens, the harder it is to handhold). Many
          wildlife photographers use blinds or camouflage.
        </p>
      </TextWrapper>
    </>
  );
};

export default HomePage;

import React from "react";
import Carousel from "react-bootstrap/Carousel";
import "../bootstrap.css";

const HomePageCarousel = () => {
  return (
    // Bootstrap carousel
    <Carousel>
      <Carousel.Item interval={3000}>
        <img
          className="d-block w-100"
          src="https://i.redd.it/41371i6u6zc31.jpg"
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>Boreal Forest</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={3000}>
        <img
          className="d-block w-100"
          src="https://cdn.wallpapersafari.com/76/34/G4XuZy.jpg"
          alt="Second slide"
        />
        <Carousel.Caption>
          <h3>Temperate Forest</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={3000}>
        <img
          className="d-block w-100"
          src="https://eskipaper.com/images/pine-tree-wallpaper-6.jpg"
          alt="Third slide"
        />
        <Carousel.Caption>
          <h3>Tropical Forest</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default HomePageCarousel;

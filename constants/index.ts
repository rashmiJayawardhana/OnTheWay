import email from "@/assets/icons/email.png";
import google from "@/assets/icons/google.png";
import lock from "@/assets/icons/lock.png";
import out from "@/assets/icons/out.png";
import person from "@/assets/icons/person.png";
import check from "@/assets/images/check.png";
import noResult from "@/assets/images/no-result.png";
import flight1 from "@/assets/images/flight1.jpeg";
import flight2 from "@/assets/images/flight2.jpeg";
import flight3 from "@/assets/images/flight3.png";
import flight4 from "@/assets/images/flight4.jpg";

export const images = {
  check,
  noResult,
  flight1,
  flight2,
  flight3,
  flight4,
};

export const icons = {
  email,
  google,
  lock,
  out,
  person,
};

export const onboarding = [
  {
    id: 1,
    title: "Track Real-Time Flights!",
    description: "Stay updated with live flight data around the globe.",
    image: images.flight3,
  },
  {
    id: 2,
    title: "Discover Flights Easily!",
    description:
      "Explore the convenience of finding and tracking your perfect flight.",
    image: images.flight1,
  },
  {
    id: 3,
    title: "Your flight, your way. Let's go!",
    description:
      "Enter your destination, sit back, and let us take care of the rest.",
    image: images.flight4,
  },
];

export const data = {
  onboarding,
};

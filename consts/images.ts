import img202504202145187037 from "@/public/media/2025-04-20_21-45-18_7037.png";
import img202504202147119137 from "@/public/media/2025-04-20_21-47-11_9137.png";
import im202504202147447055 from "@/public/media/2025-04-20_21-47-44_7055.png";
import chicken from "@/public/media/chicken.png";
import chicken1 from "@/public/media/chicken1.png";
import chicken2 from "@/public/media/chicken2.png";
import chicken3 from "@/public/media/chicken3.png";
import chicken4 from "@/public/media/chicken4.png";
import cow from "@/public/media/cow.png";
import cow1 from "@/public/media/cow1.png";
import cow2 from "@/public/media/cow2.png";
import dog from "@/public/media/dog.png";
import dog1 from "@/public/media/dog1.png";
import cat from "@/public/media/cat.png";
import cat1 from "@/public/media/cat1.png";
import cat2 from "@/public/media/cat2.png";
import cat3 from "@/public/media/cat3.png";
import goat from "@/public/media/goat.png";
import goat1 from "@/public/media/goat1.png";
import goat2 from "@/public/media/goat2.png";
import goat3 from "@/public/media/goat3.png";
import sheep from "@/public/media/sheep.png";
import sheep1 from "@/public/media/sheep1.png";
import sheep2 from "@/public/media/sheep2.png";
import sheep3 from "@/public/media/sheep3.png";
import sheep4 from "@/public/media/sheep4.png";
import horse from "@/public/media/horse.png";
import horse1 from "@/public/media/horse1.png";
import horse2 from "@/public/media/horse2.png";
import horse3 from "@/public/media/horse3.png";
import duck from "@/public/media/duck.png";
import duck1 from "@/public/media/duck1.png";
import duck2 from "@/public/media/duck2.png";
import duck3 from "@/public/media/duck3.png";
import rabbit from "@/public/media/rabbit.png";
import rabbit1 from "@/public/media/rabbit1.png";
import rabbit2 from "@/public/media/rabbit2.png";
import rabbit3 from "@/public/media/rabbit3.png";
import favIcon from "@/public/logos/header.png";
import desktopIcon from "@/public/logos/logo.png";
import mobileIcon from "@/public/logos/fullHd.png";

export const images = {
  site: {
    logo: {
      favIcon: favIcon,
      desktopIcon: desktopIcon,
      mobileIcon: mobileIcon,
    },
  },
  chickens: {
    covers: {
      1: img202504202145187037,
      2: img202504202147119137,
      3: im202504202147447055,
    },
    images: {
      1: chicken,
      2: chicken1,
      3: chicken2,
      4: chicken3,
      5: chicken4,
    },
    breeds: [
      { name: "Rhode Island Red", images: [chicken1, chicken2] },
      { name: "Leghorn", images: [chicken3, chicken4] },
      { name: "Plymouth Rock", images: [chicken, chicken] },
    ],
  },
  cows: {
    images: {
      1: cow,
      2: cow1,
      3: cow2,
    },
    breeds: [
      { name: "Holstein", images: [cow1, cow2] },
      { name: "Jersey", images: [cow, cow] },
      { name: "Angus", images: [cow, cow] },
    ],
  },
  dogs: {
    images: {
      1: dog,
      2: dog1,
    },
    breeds: [
      { name: "Labrador Retriever", images: [dog1, dog] },
      { name: "German Shepherd", images: [dog, dog1] },
      { name: "Golden Retriever", images: [dog1, dog] },
    ],
  },
  cats: {
    images: {
      1: cat,
      2: cat1,
      3: cat2,
      4: cat3,
    },
    breeds: [
      { name: "Persian", images: [cat1, cat2] },
      { name: "Siamese", images: [cat3, cat1] },
      { name: "Maine Coon", images: [cat2, cat1] },
    ],
  },
  goats: {
    images: {
      1: goat,
      2: goat1,
      3: goat2,
      4: goat3,
    },
    breeds: [
      { name: "Boer", images: [goat1, goat2] },
      { name: "Nubian", images: [goat3, goat1] },
      { name: "Alpine", images: [goat1, goat2] },
    ],
  },
  sheeps: {
    images: {
      1: sheep,
      2: sheep1,
      3: sheep2,
      4: sheep3,
      5: sheep4,
    },
    breeds: [
      { name: "Merino", images: [sheep1, sheep2] },
      { name: "Suffolk", images: [sheep3, sheep4] },
      { name: "Dorset", images: [sheep1, sheep2] },
    ],
  },
  horses: {
    images: {
      1: horse,
      2: horse1,
      3: horse2,
      4: horse3,
    },
    breeds: [
      { name: "Arabian", images: [horse1, horse2] },
      { name: "Thoroughbred", images: [horse3, horse1] },
      { name: "Quarter Horse", images: [horse2, horse1] },
    ],
  },
  ducks: {
    images: {
      1: duck,
      2: duck1,
      3: duck2,
      4: duck3,
    },
    breeds: [
      { name: "Pekin", images: [duck1, duck2] },
      { name: "Muscovy", images: [duck3, duck1] },
      { name: "Indian Runner", images: [duck1, duck2] },
    ],
  },
  rabbits: {
    images: {
      1: rabbit,
      2: rabbit1,
      3: rabbit2,
      4: rabbit3,
    },
    breeds: [
      { name: "Holland Lop", images: [rabbit1, rabbit2] },
      { name: "Netherland Dwarf", images: [rabbit3, rabbit1] },
      { name: "Rex", images: [rabbit1, rabbit2] },
    ],
  },
} as any;

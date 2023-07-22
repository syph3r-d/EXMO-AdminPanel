export enum EStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
}

export enum ECrowdStatus {
  LIGHT = "LIGHT",
  MODERATE = "MODERATE",
  HEAVY = "HEAVY",
}

export interface ILocation {
  building?: string;
  floor: number;
  section?: string;
  latitude: number;
  longitude: number;
}

export interface IEvent {
  title: string;
  subtitle?: string;
  thumbnail?: string;
  displayImage?: string;
  location: ILocation;
  faculty: string;
  caption: string;
  department: string;
  description?: string;
  hours: [
    {
      startTime: number;
      endTime: number;
    }
  ];
  images: [
    {
      url: string;
      caption?: string;
    }
  ];
  team?: [
    {
      name: string;
      title: string;
    }
  ];
  status: EStatus;
}

export interface IPlace {
  title?: string;
  status: EStatus;
  location: ILocation;
  crowdStatus?: ECrowdStatus;
}

// exhibits
export interface IExhibit extends IEvent {}

// bootcamps
export interface IBootCamp extends IEvent {}

// programs
export interface IProgram extends IEvent {}

// cafeterias
export interface ICafeteria extends IPlace {}

// cashAtms
export interface ICashATM extends IPlace {}

// washrooms
export interface IWashroom extends IPlace {}

// lives
export interface ILive {
  title: string;
  description: string;
  videoId: string;
}

// deviceIds
export interface IDeviceId {
  id: string;
}

// videos
export interface IVideo {
  imageId: string;
  videoId: string;
  title: string;
  description: string;
}

export interface IARModel {
  urlAndroid: string; // url for android
  urlIOS: string; // url for ios
  scale: number; // scale of model
  isAnimated: boolean; // is model animated or not
}

export interface IQuestion {
  question: string;
  answers: string[];
  correctAnswer: number;
}

// arCollectibles
export interface IARCollectible {
  name: string;
  model: IARModel;
  extras: IQuestion;
  isFree: boolean; // is model free or not
  showPreview: boolean; // show preview image or not
  previewImageUrL: string; // preview image for model
  department?: string | null; // department of model
}

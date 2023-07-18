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
  building: string;
  floor: number;
  section: string;
  latitude: number;
  longitude: number;
}

export interface IEvent {
  title: string;
  subtitle: string;
  thumbnail: string;
  status: EStatus;
  location: ILocation;
  faculty: string;
  department: string;
  displayImage: string;
  caption: string;
  description: string;
  hours: [
    {
      startTime: number;
      endTime: number;
    }
  ];
  images: [
    {
      url: string;
      caption: string;
    }
  ];
  team: [
    {
      name: string;
      title: string;
    }
  ];
}

export interface IExhibit extends IEvent {}

export interface IBootCamp extends IEvent {}

export interface IProgram extends IEvent {}

export interface ICafeteria {
  title: string;
  status: EStatus;
  location: ILocation;
  crowdStatus: ECrowdStatus;
}

export interface ICashATM {
  bank: string;
  location: ILocation;
}

export interface IWashroom {
  status: EStatus;
  location: ILocation;
}

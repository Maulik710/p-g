import React  from 'react';
import { compare } from 'semver';
import WSHappyHours from './WSHappyHours';
import WSPlaceImages from './WSPlaceImages';

export default class WSPlace{

  name = String;
  createdDate = String;
  placeLongitude = String;
  address = String;
  modifiedDate = String;
  websiteURL = String;
  happyHours = [WSHappyHours];
  isTestData = String;
  contactNumber = String;
  sortDescription = String;
  placeLatitude = String;
  isDeleted = Number;
  placeImages = [WSPlaceImages];
  pkPlace = Number;
  placeDescription = String;
  numberOfSpamReports = Number;
  distance = Number;

  constructor(){}
}

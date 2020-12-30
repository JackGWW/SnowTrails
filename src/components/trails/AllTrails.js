import React from "react";
import AlpineExpress from "./AlpineExpress"
import Backbowl from "./Backbowl"
import BlueBird from "./BlueBird"
import BruceTrail from "./BruceTrail"
import EnchantedForest from "./EnchantedForest"
import FarmRoad from "./FarmRoad"
import ForestGump from "./ForestGump"
import ForestLane from "./ForestLane"
import LostLoop from "./LostLoop"
import LoversLoop from "./LoversLoop"
import OverTheHill from "./OverTheHill"
import RidgeRun from "./RidgeRun"
import RobinsRun from "./RobinsRun"
import Shortcut from "./Shortcut"
import SkiAcross from "./SkiAcross"
import SweetSteeps from "./SweetSteeps"
import Switchback from "./Switchback"
import TheGlades from "./TheGlades"
import ToRiver from "./ToRiver"
import ToSouth from "./ToSouth"
import ToSteeps from "./ToSteeps"
import ToSweetSteeps from "./ToSweetSteeps"


const ShowTrail = (props) => {
  return (
    <>
      <AlpineExpress longitudeDelta={props.longitudeDelta}/>
      <Backbowl longitudeDelta={props.longitudeDelta}/>
      <BlueBird longitudeDelta={props.longitudeDelta}/>
      <BruceTrail longitudeDelta={props.longitudeDelta}/>
      <EnchantedForest longitudeDelta={props.longitudeDelta}/>
      <FarmRoad longitudeDelta={props.longitudeDelta}/>
      <ForestGump longitudeDelta={props.longitudeDelta}/>
      <ForestLane longitudeDelta={props.longitudeDelta}/>
      <LostLoop longitudeDelta={props.longitudeDelta}/>
      <LoversLoop longitudeDelta={props.longitudeDelta}/>
      <OverTheHill longitudeDelta={props.longitudeDelta}/>
      <RidgeRun longitudeDelta={props.longitudeDelta}/>
      <RobinsRun longitudeDelta={props.longitudeDelta}/>
      <Shortcut longitudeDelta={props.longitudeDelta}/>
      <SkiAcross longitudeDelta={props.longitudeDelta}/>
      <SweetSteeps longitudeDelta={props.longitudeDelta}/>
      <Switchback longitudeDelta={props.longitudeDelta}/>
      <TheGlades longitudeDelta={props.longitudeDelta}/>
      <ToRiver longitudeDelta={props.longitudeDelta}/>
      <ToSouth longitudeDelta={props.longitudeDelta}/>
      <ToSteeps longitudeDelta={props.longitudeDelta}/>
      <ToSweetSteeps longitudeDelta={props.longitudeDelta}/>
    </>
  )
}

export default ShowTrail;

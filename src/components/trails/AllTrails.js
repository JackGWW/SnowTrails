import React from "react";
import EnchantedForest from "./EnchantedForest"

const ShowTrail = (props) => {
  return (
    <>
      <EnchantedForest longitudeDelta={props.longitudeDelta}/>
    </>
  )
}

export default ShowTrail;
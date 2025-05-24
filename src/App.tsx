// import SoundTesting from "../playground/sound/SoundTesting";
// import MapGenerator from "./components/map/MapGenerator";
// import nataliaHouseMapCells from "../playground/map/nataliaHouseMap";
// import CinematicTester from "../playground/cinematic/CinematicTester";

import { Provider } from "react-redux";
import GameDirector from "./components/GameDirector";
import { store } from "./store/store";

function App() {
  return (
    <>
      <Provider store={store}>
        {/* <SoundTesting /> */}
        {/* <div className="mainContainer">
        <h1>Mapa Casa de Natalia</h1>
        <MapGenerator mapCells={nataliaHouseMapCells} />
      </div> */}
        {/* <CinematicTester /> */}
        <GameDirector />
      </Provider>
    </>
  );
}

export default App;

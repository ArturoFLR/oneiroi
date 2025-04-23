import SoundTesting from "../playground/sound/SoundTesting";
import MapGenerator from "./components/map/MapGenerator";
import nataliaHouseMapCells from "../playground/map/nataliaHouseMap";

function App() {
  return (
    <>
      <SoundTesting />
      <div className="mainContainer">
        <h1>Mapa Casa de Natalia</h1>
        <MapGenerator mapCells={nataliaHouseMapCells} />
      </div>
    </>
  );
}

export default App;

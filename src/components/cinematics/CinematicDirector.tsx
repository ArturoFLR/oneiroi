import { useCallback, useEffect, useRef, useState } from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import ScreenDarkener from "../common/ScreenDarkener";
import MainViewer from "./styled/MainViewer";
import { CinematicSceneAuto } from "./cinematicTypes";

interface CinematicDirectorProps {
  cinematicData: CinematicSceneAuto;
}

function CinematicDirector({ cinematicData }: CinematicDirectorProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [widePicture, setWidePicture] = useState<boolean>(true);
  const [actualShotIndex, setActualShotIndex] = useState<number>(0);

  const cinematicDataWithImgsRef = useRef<CinematicSceneAuto>(cinematicData);

  const preloadImages = useCallback(() => {
    let completionPercentage = 0;
    const totalImages = cinematicDataWithImgsRef.current.length;

    cinematicDataWithImgsRef.current.forEach((shot, index) => {
      const advanceCompletion = () => {
        completionPercentage += 100 / totalImages;
        setLoadingProgress(completionPercentage);
        if (completionPercentage >= 100) {
          setIsLoading(false);
        }
      };

      if (shot.mainImageUrl) {
        const img = new Image();
        img.src = shot.mainImageUrl; // Hace que la imagen se precargue en la caché del navegador, aunque no la guardemos en ningún sitio.
        img.onload = () => {
          cinematicDataWithImgsRef.current[index].mainImageElement = img;
          advanceCompletion();
          img.onerror = () => {
            console.error(
              `Cinematic Director: Error cargando la imagen: ${shot.mainImageUrl}`
            );
            advanceCompletion();
          };
        };
      } else {
        advanceCompletion();
      }
    });
  }, []);

  useEffect(() => {
    if (isLoading) {
      preloadImages();
    }
  }, [isLoading, preloadImages]);

  return (
    <ScreenDarkener color="dark">
      {isLoading ? (
        <LoadingSpinner progress={loadingProgress} />
      ) : (
        <MainViewer />
      )}
    </ScreenDarkener>
  );
}

export default CinematicDirector;

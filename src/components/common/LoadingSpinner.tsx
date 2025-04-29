import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { GLOBAL_COLORS } from "../../theme";

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
      }}
    >
      <CircularProgress variant="determinate" {...props} size={90} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: GLOBAL_COLORS.orange.highlightedText }}
          fontSize="1.8rem"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

interface LoadingSpinnerProps {
  progress: number;
}

function LoadingSpinner({ progress }: LoadingSpinnerProps) {
  return <CircularProgressWithLabel value={progress} />;
}

export default LoadingSpinner;

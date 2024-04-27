import { useEffect, useState } from "react";
import { Gig } from "../../../types/Gig";
import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";

type WeekendDetails = {
  label: string;
  dates: string[];
};

const WEEKEND_OPTIONS: Record<string, WeekendDetails> = {
  Tilt: {
    label: "Tilt (Jul 5-7)",
    dates: ["07-05", "07-06", "07-07"],
  },
  Reverb: {
    label: "Reverb (Aug 9-11)",
    dates: ["08-09", "08-10", "08-11"],
  },
};

export const CustomPhillipsGigFilters = (gigs: Gig[] | undefined) => {
  const [filteredGigs, setFilteredGigs] = useState<Gig[]>([]);
  const [isFilteredGigsLoading, setIsFilteredGigsLoading] = useState(true);
  const [selectedWeekends, setSelectedWeekends] = useState<string[]>(Object.keys(WEEKEND_OPTIONS));

  useEffect(() => {
    if (gigs) {
      setIsFilteredGigsLoading(true);

      const selectedDates = selectedWeekends.map((weekend) => WEEKEND_OPTIONS[weekend].dates).flat();

      // NOTE: This will not fetch any gigs that don't have matching dates for *either* weekend
      const filteredGigs: Gig[] = [];
      gigs?.forEach((gig) => {
        selectedDates.forEach((date) => {
          if (gig.date.includes(date)) {
            filteredGigs.push(gig);
            return;
          }
        });
      });

      setFilteredGigs(filteredGigs);
      setIsFilteredGigsLoading(false);
    }
  }, [gigs, selectedWeekends]);

  // This event is a SelectChangeEvent but our compiler was having issues with importing it
  const changeWeekend = (event: any) => {
    const value = event.target.value;
    setSelectedWeekends(typeof value === "string" ? value.split(",") : value);
  };

  const CustomWeekendPicker = (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="weekend-select-label" sx={{ color: "#FFFFFF" }}>
          Weekend
        </InputLabel>
        <Select
          id="weekend-select"
          labelId="weekend-select-label"
          multiple
          value={selectedWeekends}
          input={<OutlinedInput label="Weekend" />}
          label="weekend"
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((key) => (
                <Chip key={key} label={key} sx={{ backgroundColor: "#FFFFFF" }} />
              ))}
            </Box>
          )}
          onChange={changeWeekend}
        >
          {Object.keys(WEEKEND_OPTIONS).map((key) => (
            <MenuItem key={key} value={key}>
              <Checkbox checked={selectedWeekends.includes(key)} />
              <ListItemText primary={WEEKEND_OPTIONS[key].label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  return { filteredGigs, isFilteredGigsLoading, CustomWeekendPicker };
};

import { Box, MenuItem, Select } from '@mui/material';
import { LOCATIONS } from '../constants/locations';
import { LocationType } from '../types/RecordShopTypes';

export const Origin = ({
  origin,
  handleChangeOrigin,
}: {
  origin: string;
  handleChangeOrigin: (event: any) => void;
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ minWidth: '310px' }}>
        <Select
          value={origin}
          onChange={handleChangeOrigin}
          fullWidth
          sx={{
            height: '40px',
          }}
        >
          {LOCATIONS.map((location: LocationType) => (
            <MenuItem key={location.name} value={location.value}>
              {location.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};

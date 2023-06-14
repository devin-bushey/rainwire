import { Box, ListSubheader, MenuItem, Select } from '@mui/material';
import { LOCATIONS } from '../constants/locations';
import { LocationType } from '../types/RecordShopTypes';
import { COLOURS } from '../theme/AppStyles';

function MyListSubheader(props: any) {
  return <ListSubheader {...props} />;
}

MyListSubheader.muiSkipListHighlight = true;

export const Origin = ({
  origin,
  handleChangeOrigin,
}: {
  origin: string;
  handleChangeOrigin: (event: any) => void;
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ minWidth: '300px' }}>
        <Select
          value={origin}
          onChange={handleChangeOrigin}
          fullWidth
          sx={{
            height: '40px',
            border: `1px solid ${COLOURS.accent_04}}`,
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

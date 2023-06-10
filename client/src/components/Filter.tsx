import { Select, MenuItem, Button, Chip } from '@mui/material';
import { Box } from '@mui/system';

export const Filter = ({
  totalTickets,
  filteredGenres,
  handleFilteredGenres,
  handleDeleteGenre,
  handleClearGenres,
}: {
  totalTickets: string[];
  filteredGenres: string[];
  handleFilteredGenres: (event: any) => void;
  handleDeleteGenre: (genre: string) => () => void;
  handleClearGenres: () => void;
}) => {
  const genres: any = [];
  totalTickets.forEach((ticket: any) => {
    if (ticket?.genres === undefined) return;
    ticket.genres.forEach((genre: any) => {
      if (!genres.includes(genre)) {
        genres.push(genre);
      }
    });
  });

  return (
    <Box sx={{ marginBottom: '24px' }}>
      <Box sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto', display: 'flex', justifyContent: 'center' }}>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          fullWidth
          displayEmpty
          renderValue={() => 'Genres'}
          value={filteredGenres}
          onChange={handleFilteredGenres}
          sx={{ height: '40px' }}
          MenuProps={{
            style: {
              maxHeight: '300px',
              marginLeft: '45px',
            },
          }}
        >
          {genres.map((genre: string) => (
            <MenuItem key={genre} value={genre}>
              {genre}
            </MenuItem>
          ))}
        </Select>

        <Button
          variant="outlined"
          sx={{ marginLeft: '4px' }}
          onClick={() => {
            handleClearGenres();
          }}
        >
          Clear
        </Button>
      </Box>

      <Box
        mt={3}
        sx={{
          '& > :not(:last-child)': { mr: 1 },
          '& > *': { mr: 1 },
        }}
      >
        {filteredGenres?.map((genre) => (
          <Chip sx={{ margin: '2px' }} key={genre} label={genre} onDelete={handleDeleteGenre(genre)} />
        ))}
      </Box>
    </Box>
  );
};

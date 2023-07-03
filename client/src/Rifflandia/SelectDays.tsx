import { Card, Typography, Button } from '@mui/material';
import { Box } from '@mui/system';
import { RIFFLANDIA_COLOURS } from './constants/colours';

export const SelectDays = (props: any) => {
  const DAYS = ['Sept 7', 'Sept 8', 'Sept 9', 'Sept 15', 'Sept 16', 'Sept 17'];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Card
        sx={{
          backgroundColor: props.colour ? props.colour : 'hsl(141, 12%, 80%)',
          minHeight: '290px',
          width: '300px',
          margin: '8px',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '4px' }}>
          <Typography variant="h6">Select Days</Typography>
          <Button
            variant="outlined"
            sx={{
              bottom: '20px',
              left: '57px',
              paddingLeft: '8px',
              paddingRight: '8px',
              paddingTop: '2px',
              paddingBottom: '2px',
              minWidth: '10px',
            }}
            onClick={props.handleCloseSettings}
          >
            x
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            {DAYS.map((day: any) => (
              <Button
                variant="outlined"
                key={day}
                onClick={() => props.handleDayClick(day)}
                sx={{
                  width: '100px',
                  margin: '8px 2px',
                  marginBottom: '2px',
                  background: props.selectedDays.includes(day) ? RIFFLANDIA_COLOURS.fill_light_orange : 'none',
                  '&:hover': {
                    background: props.selectedDays.includes(day) ? RIFFLANDIA_COLOURS.fill_light_orange : 'none',
                  },
                }}
              >
                {day}
              </Button>
            ))}
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import styled from 'styled-components';

type LoopModalProps = {
  submitLoopNum: (isInfinity: boolean, numnOfLoop: number) => void;
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const LoopModal: React.FC<LoopModalProps> = ({ submitLoopNum }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isInfinity, setIsInfinity] = useState<boolean>(false);
  const [numOfLoop, setNumOfLoop] = useState<number>(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleBtnClick = () => {
    submitLoopNum(isInfinity, numOfLoop);
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (value > 0) {
      setNumOfLoop(value);
      setIsInfinity(false);
    }
  };

  const handleCheckboxClick = () => {
    const value = !isInfinity;
    setIsInfinity(value);
    if (value) setNumOfLoop(0);
  };

  return (
    <div>
      <Button onClick={handleOpen}>Repeat Section</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            How many times do you want to loop the selected section?
          </Typography>
          <LoopOptions>
            <NumberOfLoop>
              <TextField
                id='filled-basic'
                label='Enter Number here'
                variant='outlined'
                fullWidth
                onChange={handleChange}
                value={numOfLoop}
                type='number'
              />
            </NumberOfLoop>

            <Paragraph>Or</Paragraph>

            <FormControlLabel
              control={
                <Checkbox checked={isInfinity} onChange={handleCheckboxClick} />
              }
              label='Select to play infinitely'
            />
          </LoopOptions>
          <SelectedOptionBtn onClick={handleBtnClick} variant='outlined'>
            Repeat Selected Section
          </SelectedOptionBtn>
        </Box>
      </Modal>
    </div>
  );
};

export default LoopModal;

const Paragraph = styled(Typography)`
  padding: 10px;
  text-align: center;
`;

const NumberOfLoop = styled(Box)`
  padding-top: 30px;
`;

const LoopOptions = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SelectedOptionBtn = styled(Button)`
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
`;

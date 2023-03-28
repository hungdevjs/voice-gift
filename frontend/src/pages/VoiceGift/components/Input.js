import { useMemo } from 'react';
import { Box } from '@mui/material';

const Input = ({ sx = {}, inputSx = {}, Icon = null, ...rest }) => {
  const isTextArea = rest.type === 'textarea';
  const Component = useMemo(
    () =>
      isTextArea
        ? (props) => <textarea {...props} />
        : (props) => <input {...props} />,
    [isTextArea]
  );

  return (
    <Box
      width="100%"
      borderRadius={2}
      border="1px solid #ccc"
      px={2}
      py={1}
      display="flex"
      alignItems="center"
      gap={1}
      sx={sx}
    >
      <Component
        {...rest}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          ...inputSx,
        }}
      />
      {Icon}
    </Box>
  );
};

export default Input;

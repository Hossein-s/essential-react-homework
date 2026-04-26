import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
import { useFormik } from 'formik';
import type { ReactNode } from 'react';
import { useState } from 'react';
import * as Yup from 'yup';
import { API_BASE } from './lotteryApi';

const addLotteryFormSchema = Yup.object({
  name: Yup.string().min(4, 'name must be at least 4 characters'),
  prize: Yup.string().min(4, 'prize must be at least 4 characters'),
});

type AddLotteryFormValues = Yup.InferType<typeof addLotteryFormSchema>;

type AddLotterySectionProps = {
  onLotteryCreated?: () => void;
  children?: ReactNode;
};

export function AddLotterySection({
  onLotteryCreated,
  children,
}: AddLotterySectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const formik = useFormik<AddLotteryFormValues>({
    initialValues: {
      name: '',
      prize: '',
    },
    validationSchema: addLotteryFormSchema,
    validateOnMount: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch(`${API_BASE}/lotteries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: values.name,
            prize: values.prize,
            type: 'simple' as const,
          }),
        });

        const data: unknown = await response.json().catch(() => ({}));
        if (!response.ok) {
          const errMsg =
            typeof data === 'object' &&
            data !== null &&
            'error' in data &&
            typeof (data as { error: unknown }).error === 'string'
              ? (data as { error: string }).error
              : 'Failed to add lottery. Please try again.';

          setSnackbar({ open: true, message: errMsg, severity: 'error' });
          return;
        }

        setDialogOpen(false);
        resetForm();
        setSnackbar({
          open: true,
          message: 'New lottery created',
          severity: 'success',
        });
        onLotteryCreated?.();
      } catch {
        setSnackbar({
          open: true,
          message: 'Could not reach the server. Please try again.',
          severity: 'error',
        });
      }
    },
  });

  const closeDialog = () => {
    if (formik.isSubmitting) return;
    setDialogOpen(false);
    formik.resetForm();
  };

  const addButtonDisabled = !formik.isValid && !formik.isSubmitting;

  return (
    <>
      <Box
        sx={(theme) => ({
          position: 'fixed',
          right: 0,
          bottom: 0,
          p: 2,
          zIndex: theme.zIndex.fab,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1,
        })}
      >
        {children}
        <Fab
          variant="extended"
          color="primary"
          aria-label="add lottery"
          onClick={() => {
            formik.resetForm();
            setDialogOpen(true);
          }}
          sx={{ textTransform: 'uppercase' }}
        >
          <AddIcon />
          Add lottery
        </Fab>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => {
          if (formik.isSubmitting) return;
          closeDialog();
        }}
      >
        <DialogTitle sx={{ color: 'text.primary' }}>
          Add a new lottery
        </DialogTitle>
        <form onSubmit={formik.handleSubmit} noValidate>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              margin="normal"
              variant="standard"
              id="add-lottery-name"
              name="name"
              label="Lottery name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              fullWidth
              margin="normal"
              variant="standard"
              id="add-lottery-prize"
              name="prize"
              label="Lottery prize"
              value={formik.values.prize}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.prize && Boolean(formik.errors.prize)}
              helperText={formik.touched.prize && formik.errors.prize}
            />
          </DialogContent>
          <DialogActions>
            <LoadingButton
              type="submit"
              loading={formik.isSubmitting}
              disabled={addButtonDisabled}
              variant="contained"
              color="primary"
            >
              Add
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        onClose={(_, reason) => {
          if (reason === 'clickaway') return;
          setSnackbar((s) => ({ ...s, open: false }));
        }}
        autoHideDuration={5000}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

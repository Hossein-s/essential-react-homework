import Casino from "@mui/icons-material/Casino";
import Search from "@mui/icons-material/Search";
import SentimentVeryDissatisfied from "@mui/icons-material/SentimentVeryDissatisfied";
import Sync from "@mui/icons-material/Sync";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { AddLotterySection } from "./AddLotterySection";
import { fetchLotteries, registerForLottery } from "./lotteryApi";
import type { Lottery } from "./lotteryTypes";

const registerSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(1, "Enter your name")
    .required("Enter your name"),
});

type RegisterFormValues = Yup.InferType<typeof registerSchema>;

function toggleSetMember(set: Set<string>, id: string, include: boolean): void {
  if (include) set.add(id);
  else set.delete(id);
}

function pruneSelected(prev: Set<string>, list: Lottery[]): Set<string> {
  const next = new Set<string>();
  for (const id of prev) {
    const l = list.find((r) => r.id === id);
    if (l && l.status === "running") next.add(id);
  }
  return next;
}

function LotteriesView() {
  const [rows, setRows] = useState<Lottery[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [registerOpen, setRegisterOpen] = useState(false);
  const [registerSnackbar, setRegisterSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length === 0) return rows;
    return rows.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.prize.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q),
    );
  }, [rows, searchQuery]);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const list = await fetchLotteries();
      setRows(list);
      setSelected((prev) => pruneSelected(prev, list));
    } catch {
      setLoadError("Could not load lotteries. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // async load; eslint flags indirect setState
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const selectedRunningIds = Array.from(selected).filter((id) => {
    const l = rows.find((r) => r.id === id);
    return l && l.status === "running";
  });
  const hasSelection = selectedRunningIds.length > 0;

  const registerForm = useFormik<RegisterFormValues>({
    initialValues: { name: "" },
    validationSchema: registerSchema,
    onSubmit: async (values, { resetForm }) => {
      if (selectedRunningIds.length === 0) return;
      try {
        for (const lotteryId of selectedRunningIds) {
          await registerForLottery(lotteryId, values.name.trim());
        }
        setRegisterOpen(false);
        resetForm();
        setSelected(new Set());
        setRegisterSnackbar({
          open: true,
          message: "Registered to lotteries.",
          severity: "success",
        });
        await load();
      } catch (e) {
        setRegisterSnackbar({
          open: true,
          message: e instanceof Error ? e.message : "Registration failed.",
          severity: "error",
        });
      }
    },
  });

  const addRegisterFormDisabled =
    !registerForm.isValid && !registerForm.isSubmitting;

  const shouldShowNameError = Boolean(
    registerForm.errors.name &&
    (registerForm.touched.name || registerForm.submitCount > 0),
  );
  const nameErrorHelper =
    (registerForm.touched.name || registerForm.submitCount > 0) &&
    registerForm.errors.name
      ? registerForm.errors.name
      : undefined;

  const openRegister = () => {
    if (!hasSelection) return;
    registerForm.resetForm();
    setRegisterOpen(true);
  };

  const closeRegister = () => {
    if (registerForm.isSubmitting) return;
    setRegisterOpen(false);
    registerForm.resetForm();
  };

  return (
    <Box
      component="main"
      sx={{ bgcolor: "background.default", minHeight: "100svh", pb: 10 }}
    >
      <Container maxWidth="lg" sx={{ py: 4, px: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mb: 3,
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{ color: "text.primary" }}
          >
            Lotteries
          </Typography>
          <Casino aria-hidden sx={{ color: "text.primary" }} />
        </Box>

        {loadError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loadError}
          </Alert>
        )}

        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "50vh",
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        ) : rows.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              minHeight: "40vh",
            }}
          >
            <SentimentVeryDissatisfied
              aria-hidden
              color="action"
              sx={{ fontSize: 56, opacity: 0.5 }}
            />
            <Typography color="text.secondary">
              There are no lotteries currently
            </Typography>
          </Box>
        ) : (
          <>
            <TextField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="search-lotteries"
              label="Search"
              type="search"
              variant="outlined"
              fullWidth
              sx={{ maxWidth: 600, mx: "auto", mb: 3, display: "block" }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search fontSize="small" aria-hidden />
                    </InputAdornment>
                  ),
                },
              }}
            />
            {filteredRows.length === 0 && searchQuery.trim() !== "" ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minHeight: "30vh",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ color: "text.primary" }}>
                  No search results for &apos;{searchQuery.trim()}&apos;
                </Typography>
              </Box>
            ) : (
              <Grid
                container
                spacing={2}
                columnSpacing={2}
                rowSpacing={2}
                columns={12}
                sx={{ width: 1, justifyContent: "center" }}
              >
                {filteredRows.map((l) => {
                  const isFinished = l.status === "finished";
                  const isSelected = selected.has(l.id) && !isFinished;
                  return (
                    <Grid key={l.id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Card
                        variant="outlined"
                        sx={{
                          boxSizing: "border-box",
                          borderWidth: 2,
                          borderStyle: "solid",
                          borderColor: isSelected ? "primary.main" : "divider",
                          opacity: isFinished ? 0.5 : 1,
                        }}
                      >
                        <CardActionArea
                          disabled={isFinished}
                          onClick={() => {
                            if (isFinished) return;
                            setSelected((prev) => {
                              const next = new Set(prev);
                              const nextOn = !next.has(l.id);
                              toggleSetMember(next, l.id, nextOn);
                              return next;
                            });
                          }}
                          aria-pressed={!isFinished ? isSelected : undefined}
                        >
                          <CardContent>
                            <CardHeader
                              sx={{ p: 0, alignItems: "flex-start" }}
                              action={
                                <IconButton
                                  size="small"
                                  edge="end"
                                  aria-label="Sync"
                                  disabled={isFinished}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                  onKeyDown={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <Sync fontSize="small" />
                                </IconButton>
                              }
                              title={
                                <Typography
                                  component="div"
                                  variant="h6"
                                  sx={{ color: "text.primary" }}
                                >
                                  {l.name}
                                </Typography>
                              }
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              {l.prize}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.disabled"
                              component="p"
                              sx={{
                                mt: 1,
                                display: "block",
                                wordBreak: "break-all",
                              }}
                            >
                              {l.id}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </>
        )}
      </Container>

      <AddLotterySection onLotteryCreated={() => void load()}>
        <Button
          type="button"
          variant="contained"
          color="inherit"
          size="large"
          disabled={!hasSelection}
          onClick={openRegister}
          sx={{
            textTransform: "uppercase",
            borderRadius: 9999,
            px: 2.5,
            py: 1.25,
          }}
        >
          Register
        </Button>
      </AddLotterySection>

      <Dialog
        open={registerOpen}
        onClose={() => {
          if (registerForm.isSubmitting) return;
          closeRegister();
        }}
      >
        <DialogTitle sx={{ color: "text.primary" }}>
          Register for a lottery
        </DialogTitle>
        <form onSubmit={registerForm.handleSubmit} noValidate>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              margin="normal"
              name="name"
              id="register-name"
              label="Enter your name"
              variant="standard"
              value={registerForm.values.name}
              onChange={registerForm.handleChange}
              onBlur={registerForm.handleBlur}
              error={shouldShowNameError}
              helperText={nameErrorHelper}
            />
          </DialogContent>
          <DialogActions>
            <LoadingButton
              type="submit"
              loading={registerForm.isSubmitting}
              disabled={addRegisterFormDisabled}
              variant="contained"
              color="primary"
              sx={{
                textTransform: "uppercase",
                borderRadius: 9999,
                px: 2.5,
                py: 1.25,
              }}
            >
              Register
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={registerSnackbar.open}
        onClose={(_, reason) => {
          if (reason === "clickaway") return;
          setRegisterSnackbar((s) => ({ ...s, open: false }));
        }}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setRegisterSnackbar((s) => ({ ...s, open: false }))}
          severity={registerSnackbar.severity}
        >
          {registerSnackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export { LotteriesView };

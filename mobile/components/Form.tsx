import { Formik } from 'formik';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { Lottery } from '../types';
import { validateRequiredFields } from '../utils/validateRequiredFields';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  fieldError: {
    color: '#c00',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  apiError: {
    color: '#c00',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    padding: 14,
    alignItems: 'center',
    opacity: 1,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonLabel: {
    color: '#fff',
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 88,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    borderRadius: 6,
  },
  cancelLabel: {
    fontSize: 16,
  },
  submitPressable: {
    marginLeft: 12,
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 6,
    opacity: 1,
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitLabel: {
    color: '#fff',
    fontSize: 16,
  },
  selectionSummary: {
    marginBottom: 16,
  },
  selectionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  selectionItem: {
    fontSize: 15,
    marginBottom: 4,
  },
});

type FieldProps = {
  accessibilityLabel: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: (e?: unknown) => void;
  error?: string;
  touched?: boolean;
  editable: boolean;
};

function Field({
  accessibilityLabel,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  touched,
  editable,
}: FieldProps) {
  return (
    <View>
      <TextInput
        accessibilityLabel={accessibilityLabel}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        editable={editable}
        style={styles.input}
      />
      {touched && error ? (
        <Text style={styles.fieldError}>{error}</Text>
      ) : null}
    </View>
  );
}

type AddLotteryValues = { name: string; prize: string };
type RegisterValues = { name: string };

type AddLotteryProps = {
  variant: 'addLottery';
  onSubmit: (values: { name: string; prize: string }) => Promise<void>;
  loading: boolean;
  error?: string;
};

type RegisterProps = {
  variant: 'register';
  lotteries: Lottery[];
  onSubmit: (name: string) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  error?: string;
};

export type FormProps = AddLotteryProps | RegisterProps;

export function Form(props: FormProps) {
  const { loading, error } = props;

  if (props.variant === 'addLottery') {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.screen}
      >
        <Formik<AddLotteryValues>
          initialValues={{ name: '', prize: '' }}
          validate={(values) => validateRequiredFields(values, ['name', 'prize'])}
          validateOnMount
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await props.onSubmit({
                name: values.name.trim(),
                prize: values.prize.trim(),
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isValid,
            isSubmitting,
          }) => {
            const busy = loading || isSubmitting;

            return (
              <View>
                <Field
                  accessibilityLabel="Lottery name"
                  placeholder="Name"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  error={errors.name}
                  touched={touched.name}
                  editable={!busy}
                />
                <Field
                  accessibilityLabel="Prize"
                  placeholder="Prize"
                  value={values.prize}
                  onChangeText={handleChange('prize')}
                  onBlur={handleBlur('prize')}
                  error={errors.prize}
                  touched={touched.prize}
                  editable={!busy}
                />
                {error ? <Text style={styles.apiError}>{error}</Text> : null}
                <Pressable
                  style={[
                    styles.primaryButton,
                    busy || !isValid ? styles.primaryButtonDisabled : null,
                  ]}
                  onPress={() => {
                    handleSubmit();
                  }}
                  disabled={busy || !isValid}
                >
                  {busy ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryButtonLabel}>Add</Text>
                  )}
                </Pressable>
              </View>
            );
          }}
        </Formik>
      </KeyboardAvoidingView>
    );
  }

  const { lotteries, onSubmit, onCancel } = props;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <Formik<RegisterValues>
        initialValues={{ name: '' }}
        validate={(values) => validateRequiredFields(values, ['name'])}
        validateOnMount
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await onSubmit(values.name.trim());
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
          isSubmitting,
        }) => {
          const busy = loading || isSubmitting;

          return (
            <View>
              <View style={styles.selectionSummary}>
                <Text style={styles.selectionLabel}>Registering for:</Text>
                {lotteries.map((l) => (
                  <Text key={l.id} style={styles.selectionItem}>
                    • {l.name}
                  </Text>
                ))}
              </View>
              <Field
                accessibilityLabel="Your name"
                placeholder="Name"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                error={errors.name}
                touched={touched.name}
                editable={!busy}
              />
              {error ? <Text style={styles.apiError}>{error}</Text> : null}
              <View style={styles.actions}>
                <Pressable
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={onCancel}
                  disabled={busy}
                >
                  <Text style={styles.cancelLabel}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.actionButton,
                    styles.submitPressable,
                    styles.submitButton,
                    busy || !isValid ? styles.submitDisabled : null,
                  ]}
                  onPress={() => {
                    handleSubmit();
                  }}
                  disabled={busy || !isValid}
                >
                  {busy ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitLabel}>Register</Text>
                  )}
                </Pressable>
              </View>
            </View>
          );
        }}
      </Formik>
    </KeyboardAvoidingView>
  );
}

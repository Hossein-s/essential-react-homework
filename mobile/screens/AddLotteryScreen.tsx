import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLayoutEffect } from 'react';
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
import { useNewLottery } from '../hooks/useNewLottery';
import { stackHeaderOptions } from '../navigation/headerOptions';
import type { RootStackParamList } from '../types';

type LotteryFormValues = {
  name: string;
  prize: string;
};

function validateLottery(values: LotteryFormValues) {
  const errors: Partial<Record<keyof LotteryFormValues, string>> = {};

  if (!values.name.trim()) {
    errors.name = 'Required';
  }

  if (!values.prize.trim()) {
    errors.prize = 'Required';
  }

  return errors;
}

const styles = StyleSheet.create({
  root: {
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
  button: {
    backgroundColor: '#4F46E5',
    padding: 14,
    alignItems: 'center',
    opacity: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});

type Nav = NativeStackNavigationProp<RootStackParamList, 'AddLottery'>;

export function AddLotteryScreen() {
  const navigation = useNavigation<Nav>();
  const { createNewLottery, loading, error } = useNewLottery();

  useLayoutEffect(() => {
    navigation.setOptions({
      ...stackHeaderOptions,
      title: 'Add new Lottery',
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}
    >
      <Formik<LotteryFormValues>
        initialValues={{ name: '', prize: '' }}
        validate={validateLottery}
        validateOnMount
        onSubmit={async (values) => {
          try {
            await createNewLottery({
              name: values.name.trim(),
              prize: values.prize.trim(),
            });
            navigation.goBack();
          } catch {
            // error surfaced via hook
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
        }) => (
          <View>
            <TextInput
              accessibilityLabel="Lottery name"
              placeholder="Name"
              value={values.name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              editable={!loading}
              style={styles.input}
            />
            {touched.name && errors.name ? (
              <Text style={styles.fieldError}>{errors.name}</Text>
            ) : null}
            <TextInput
              accessibilityLabel="Prize"
              placeholder="Prize"
              value={values.prize}
              onChangeText={handleChange('prize')}
              onBlur={handleBlur('prize')}
              editable={!loading}
              style={styles.input}
            />
            {touched.prize && errors.prize ? (
              <Text style={styles.fieldError}>{errors.prize}</Text>
            ) : null}
            {error ? <Text style={styles.apiError}>{error}</Text> : null}
            <Pressable
              style={[
                styles.button,
                loading || !isValid ? styles.buttonDisabled : null,
              ]}
              onPress={() => {
                handleSubmit();
              }}
              disabled={loading || !isValid}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonLabel}>Add</Text>
              )}
            </Pressable>
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
}

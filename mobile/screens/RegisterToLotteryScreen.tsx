import { Formik } from 'formik';
import { useEffect, useLayoutEffect, useState } from 'react';
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
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { appendRegisteredLotteryIds } from '../hooks/useRegisteredLoterries';
import { stackHeaderOptions } from '../navigation/headerOptions';
import type { RootStackParamList } from '../types';
import * as LotteryService from '../services/lottery';

type FormValues = {
  name: string;
};

function validateName(values: FormValues) {
  const errors: Partial<Record<keyof FormValues, string>> = {};
  if (!values.name.trim()) {
    errors.name = 'Required';
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  submitPressable: {
    marginLeft: 12,
  },
  button: {
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

type RegisterNav = NativeStackNavigationProp<
  RootStackParamList,
  'RegisterToLottery'
>;
type RegisterRoute = RouteProp<RootStackParamList, 'RegisterToLottery'>;

export function RegisterToLotteryScreen() {
  const navigation = useNavigation<RegisterNav>();
  const route = useRoute<RegisterRoute>();
  const { lotteries } = route.params;

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>();

  useEffect(() => {
    setApiError(undefined);
  }, [lotteries]);

  useLayoutEffect(() => {
    navigation.setOptions({
      ...stackHeaderOptions,
      title: 'Register to lottery',
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}
    >
      <Formik<FormValues>
        initialValues={{ name: '' }}
        validate={validateName}
        validateOnMount
        onSubmit={async (values) => {
          setApiError(undefined);
          setLoading(true);
          const name = values.name.trim();
          try {
            for (const lottery of lotteries) {
              await LotteryService.registerToLottery({
                name,
                lotteryId: lottery.id,
              });
            }
            await appendRegisteredLotteryIds(lotteries.map((l) => l.id));
            setLoading(false);
            navigation.navigate('Home', { lotteryRegistered: true });
          } catch (e) {
            setLoading(false);
            setApiError(
              e instanceof Error ? e.message : 'Something went wrong',
            );
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
            <View style={styles.selectionSummary}>
              <Text style={styles.selectionLabel}>Registering for:</Text>
              {lotteries.map((l) => (
                <Text key={l.id} style={styles.selectionItem}>
                  • {l.name}
                </Text>
              ))}
            </View>
            <TextInput
              accessibilityLabel="Your name"
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
            {apiError ? <Text style={styles.apiError}>{apiError}</Text> : null}
            <View style={styles.actions}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  navigation.goBack();
                }}
                disabled={loading}
              >
                <Text style={styles.cancelLabel}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.button,
                  styles.submitPressable,
                  styles.submitButton,
                  loading || !isValid ? styles.submitDisabled : null,
                ]}
                onPress={() => {
                  handleSubmit();
                }}
                disabled={loading || !isValid}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitLabel}>Register</Text>
                )}
              </Pressable>
            </View>
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
}

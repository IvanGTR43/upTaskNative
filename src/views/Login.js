import React, {useState} from 'react';
import {StyleSheet, View, Keyboard} from 'react-native';
import {
  Button,
  Text,
  Heading,
  useToast,
  FormControl,
  Stack,
  Input,
  Center,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {gql, useMutation} from '@apollo/client';

import globalStyles from '../styles/global';

const AUTENTICAR_CUENTA = gql`
  mutation autenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //Apollo
  const [autenticarUsuario] = useMutation(AUTENTICAR_CUENTA);

  //navegacion
  const navigation = useNavigation();

  const toast = useToast();

  const handleSubmit = async () => {
    Keyboard.dismiss();
    setLoading(true);

    // validar
    if (email === '' || password === '') {
      setLoading(false);
      toast.show({
        description: 'Todos los comapos son obligatorios',
        status: 'error',
      });
      return;
    }
    //password 6+ caracteres
    if (password.length < 6) {
      setLoading(false);
      toast.show({
        description: 'La Contraseña debe tener al menos 6 caracteres',
        status: 'error',
      });
      return;
    }

    //intentar logear
    try {
      const {data} = await autenticarUsuario({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
      const {token} = data.autenticarUsuario;
      await AsyncStorage.setItem('token', token);
      navigation.navigate('proyectos');
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.show({
        description: err.message.replace('GraphQL error:', ''),
      });
    }
  };

  return (
    <View style={[globalStyles.contenido, {backgroundColor: '#e84347'}]}>
      <Center>
        <Heading color="white" fontSize={36} mb={20} fontWeiht="bold">
          UpTask
        </Heading>
        <FormControl>
          <Stack mx="2.5%">
            <Stack alignItems="center">
              <FormControl.Label>Correo</FormControl.Label>
              <Input
                keyboardType="email-address"
                placeholder="Email"
                variant="underlined"
                onChangeText={text => setEmail(text.toLowerCase())}
                width="100%"
                mb={5}
                backgroundColor="white"
              />
            </Stack>
            <Stack alignItems="center">
              <FormControl.Label>Password</FormControl.Label>
              <Input
                placeholder="Password"
                variant="underlined"
                onChangeText={text => setPassword(text)}
                width="100%"
                mb={5}
                backgroundColor="white"
                secureTextEntry={true}
              />
            </Stack>
          </Stack>
        </FormControl>
        <Button
          width="95%"
          backgroundColor="#28303b"
          mt="20px"
          _text={{
            fontWeiht: 'bold',
            color: '#fff',
          }}
          onPress={handleSubmit}
          isLoading={loading}>
          INICIAR SESION
        </Button>
        <Text
          color="white"
          mt="60px"
          textAlign="center"
          fontSize="18px"
          bold
          onPress={() => navigation.navigate('crear-cuenta')}>
          Crear Cuenta
        </Text>
      </Center>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});

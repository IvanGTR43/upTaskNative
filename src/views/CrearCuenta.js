import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Container,
  Button,
  Text,
  Heading,
  useToast,
  FormControl,
  Stack,
  Input,
  Center,
} from 'native-base';
import {useNavigation} from '@react-navigation/native';

import {gql, useMutation} from '@apollo/client';

import globalStyles from '../styles/global';

const NUEVA_CUENTA = gql`
  mutation crearUsuario($input: UsuarioInput) {
    crearUsuario(input: $input)
  }
`;

const CrearCuenta = () => {
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [mensaje, setMensaje] = useState(null);

  // navigation
  const navigation = useNavigation();

  // mutation de apollo
  const [crearUsuario] = useMutation(NUEVA_CUENTA);

  // el presiona en crear cuenta

  const toast = useToast();
  const handleSubmit = async () => {
    setLoading(true);

    // validar
    if (nombre === '' || email === '' || password === '') {
      toast.show({
        description: 'Todos los comapos son obligatorios',
        status: 'error',
      });
      setLoading(false);
      return;
    }
    //password 6+ caracteres
    if (password.length < 6) {
      toast.show({
        description: 'La Contraseña debe tener al menos 6 caracteres',
        status: 'error',
      });
      setLoading(false);
      return;
    }
    try {
      const {data} = await crearUsuario({
        variables: {
          input: {
            nombre,
            email,
            password,
          },
        },
      });

      setMensaje(data.crearUsuario);
      setLoading(false);
      toast.show({
        description: mensaje,
        message: data.crearUsuario,
      });
      navigation.navigate('login');
    } catch (error) {
      setMensaje();
      console.log(error);
      setLoading(false);
      toast.show({
        description: error.message.replace('GraphQL error:', ''),
        status: 'error',
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
              <FormControl.Label>Nombre</FormControl.Label>
              <Input
                value={nombre}
                onChangeText={e => setNombre(e)}
                placeholder="Nombre"
                variant="underlined"
                width="100%"
                mb={5}
                backgroundColor="white"
              />
            </Stack>
            <Stack alignItems="center">
              <FormControl.Label>Correo</FormControl.Label>
              <Input
                placeholder="Email"
                value={email}
                onChangeText={e => setEmail(e)}
                variant="underlined"
                width="100%"
                mb={5}
                backgroundColor="white"
              />
            </Stack>
            <Stack alignItems="center">
              <FormControl.Label>Password</FormControl.Label>
              <Input
                value={password}
                onChangeText={e => setPassword(e)}
                placeholder="Password"
                variant="underlined"
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
          isLoading={loading}
          mt="20px"
          _text={{
            fontWeiht: 'bold',
            color: '#fff',
          }}
          onPress={() => handleSubmit()}>
          CREAR CUENTA
        </Button>
      </Center>
    </View>
  );
};

export default CrearCuenta;

const styles = StyleSheet.create({});

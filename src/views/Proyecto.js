import React, {useState} from 'react';
import {StyleSheet, View, Keyboard} from 'react-native';
import {Button, Heading, FlatList, Input, useToast, Spinner} from 'native-base';

import {gql, useMutation, useQuery} from '@apollo/client';

import Tarea from '../components/Tarea';
import globalStyles from '../styles/global';

const NUEVA_TAREA = gql`
  mutation nuevaTarea($input: TareaInput) {
    nuevaTarea(input: $input) {
      nombre
      id
      proyecto
      estado
    }
  }
`;

const OBTENER_TAREAS = gql`
  query obtenerTareas($input: ProyectoIdInput) {
    obtenerTareas(input: $input) {
      id
      nombre
      estado
    }
  }
`;

const Proyecto = ({route}) => {
  const {id} = route.params;

  const [nombre, setNombre] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Apollo obtener Tareas
  const {data, loading, error} = useQuery(OBTENER_TAREAS, {
    variables: {
      input: {
        proyecto: id,
      },
    },
  });

  // Apollo agregar tareas
  const [nuevaTarea] = useMutation(NUEVA_TAREA, {
    update(cache, {data: {nuevaTarea}}) {
      const {obtenerTareas} = cache.readQuery({
        query: OBTENER_TAREAS,
        variables: {
          input: {
            proyecto: id,
          },
        },
      });
      cache.writeQuery({
        query: OBTENER_TAREAS,
        variables: {
          input: {
            proyecto: id,
          },
        },
        data: {
          obtenerTareas: [...obtenerTareas, nuevaTarea],
        },
      });
    },
  });

  const toast = useToast();

  // Validar y Crear TAreas
  const handleSubmit = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
    if (!nombre) {
      toast.show({
        description: 'El nombre es obligatorio',
        status: 'warning',
      });
      setIsLoading(false);
      return;
    }

    try {
      // agregar Proyecto a la bd
      await nuevaTarea({
        variables: {
          input: {
            nombre,
            proyecto: id,
          },
        },
      });
      toast.show({
        description: 'Tarea Agregada Correctamente',
        status: 'success',
      });
      setIsLoading(false);
      setNombre('');
    } catch (error) {
      console.log(error);
      toast.show({
        description: error.message.replace('GraphQL error:', ''),
        status: 'error',
        duration: 3000,
      });
      setIsLoading(false);
    }
  };

  return (
    <View style={{backgroundColor: '#e84347', flex: 1}}>
      <Input
        my={'2.5%'}
        backgroundColor={'white'}
        mx={'8%'}
        placeholder="Nombre de la Tarea"
        placeholderTextColor={'gray.600'}
        onChangeText={text => setNombre(text)}
        value={nombre}
      />
      <Button
        backgroundColor="#28303b"
        _text={{
          fontWeight: 'bold',
        }}
        mx={'8%'}
        onPress={() => handleSubmit()}
        isLoading={isLoading}
        isLoadingText="CREANDO TAREA ...">
        CREAR TAREA
      </Button>

      <Heading color="white" textAlign={'center'} mt="16px">
        Tareas: {route.params.nombre}
      </Heading>
      {loading ? (
        <Spinner size={'lg'} mt={'20px'} />
      ) : (
        <FlatList
          data={data.obtenerTareas}
          renderItem={({item}) => <Tarea item={item} idProyecto={id} />}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

export default Proyecto;

const styles = StyleSheet.create({});

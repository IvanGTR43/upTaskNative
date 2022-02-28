import React from 'react';
import {Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Box, useToast, Text, HStack, Pressable, Center} from 'native-base';
import {gql, useMutation} from '@apollo/client';

const ACTUALIZAR_TAREA = gql`
  mutation actualizarTarea($id: ID!, $input: TareaInput, $estado: Boolean) {
    actualizarTarea(id: $id, input: $input, estado: $estado) {
      nombre
      id
      proyecto
      estado
    }
  }
`;

const ELIMINAR_TAREA = gql`
  mutation eliminarTarea($id: ID!) {
    eliminarTarea(id: $id)
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

const Tarea = ({item, idProyecto}) => {
  const {id, nombre, estado} = item;
  // Apollo
  const [actualizarTarea] = useMutation(ACTUALIZAR_TAREA);
  const [eliminarTarea] = useMutation(ELIMINAR_TAREA, {
    update(cache) {
      const {obtenerTareas} = cache.readQuery({
        query: OBTENER_TAREAS,
        variables: {
          input: {
            proyecto: idProyecto,
          },
        },
      });
      cache.writeQuery({
        query: OBTENER_TAREAS,
        variables: {
          input: {
            proyecto: idProyecto,
          },
        },
        data: {
          ...obtenerTareas,
          obtenerTareas: obtenerTareas.filter(tarea => tarea.id !== id),
        },
      });
    },
  });

  // Toast
  const toast = useToast();
  const cambiarEstado = async () => {
    try {
      await actualizarTarea({
        variables: {
          id,
          input: {
            nombre,
          },
          estado: !estado,
        },
      });
    } catch (error) {
      console.log(error);
      toast.show({
        description: error.message.replace('GraphQL error:', ''),
        status: 'error',
      });
    }
  };

  // Dialogo para eliminar o no una Tarea
  const mostrarEliminar = () => {
    Alert.alert('Eliminar Tarea', '¿Deseas Eliminar esta Tarea?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => eliminarTareaDB(),
      },
    ]);
  };

  const eliminarTareaDB = async () => {
    try {
      await eliminarTarea({
        variables: {
          id,
        },
      });
      toast.show({
        description: 'Tarea Eliminada',
        duration: 500,
      });
    } catch (error) {
      toast.show({
        description: error.message.replace('GraphQL error:', ''),
        status: 'error',
      });
    }
  };

  return (
    <Box>
      <Center>
        <Pressable width="84%" onLongPress={() => mostrarEliminar()}>
          <HStack backgroundColor={'white'} justifyContent="space-between">
            <Text my={'16px'} bold ml={'8px'}>
              {nombre}
            </Text>
            <Box my={'16px'} mr={'8px'}>
              <Icon
                name={
                  estado
                    ? 'checkbox-marked-circle'
                    : 'checkbox-marked-circle-outline'
                }
                size={32}
                color={estado ? 'green' : 'gray'}
                onPress={() => cambiarEstado()}
              />
            </Box>
          </HStack>
        </Pressable>
      </Center>
    </Box>
  );
};

export default Tarea;

import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Heading, useToast} from 'native-base';
import {gql, useMutation} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';

import FormularioNuevoProyecto from '../components/FormularioNuevoProyecto';
import globalStyles from '../styles/global';

const NUEVO_PROYECTO = gql`
  mutation nuevoProyecto($input: ProyectoInput) {
    nuevoProyecto(input: $input) {
      nombre
      id
    }
  }
`;

// Actualizar CAche
const OBTENER_PROYECTOS = gql`
  query obtenerProyectos {
    obtenerProyectos {
      id
      nombre
    }
  }
`;

const NuevoProyecto = () => {
  const [nombre, setNombre] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // Apollo
  const [nuevoProyecto] = useMutation(NUEVO_PROYECTO, {
    update(cache, {data: {nuevoProyecto}}) {
      const {obtenerProyectos} = cache.readQuery({query: OBTENER_PROYECTOS});
      cache.writeQuery({
        query: OBTENER_PROYECTOS,
        data: {obtenerProyectos: obtenerProyectos.concat([nuevoProyecto])},
      });
    },
  });

  //navegacion
  const navigation = useNavigation();

  // toast
  const toast = useToast();

  // validar crear Proyecto
  const handleSubmit = async () => {
    setIsLoading(true);
    if (!nombre) {
      toast.show({
        description: 'El nombre no puede estar Vacio',
      });
      setIsLoading(false);
      return;
    }
    // Guardar Proyecto
    try {
      const {data} = await nuevoProyecto({
        variables: {
          input: {
            nombre,
          },
        },
      });
      toast.show({
        description: 'Proyecto Ceeado Correctamente',
        status: 'success',
      });
      setIsLoading(false);
      navigation.navigate('proyectos');
    } catch (error) {
      console.log(error);
      toast.show({
        description: error.message.replace('GraphQL error:', ''),
      });
      setIsLoading(false);
    }
  };
  return (
    <View style={[globalStyles.contenido, styles.viewPrincipal]}>
      <Heading color={'white'} textAlign={'center'} mb={5}>
        Nuevo Proyecto
      </Heading>
      <FormularioNuevoProyecto
        handleSubmit={handleSubmit}
        setNombre={setNombre}
        isLoading={isLoading}
      />
    </View>
  );
};

export default NuevoProyecto;

const styles = StyleSheet.create({
  viewPrincipal: {
    backgroundColor: '#e84347',
  },
});

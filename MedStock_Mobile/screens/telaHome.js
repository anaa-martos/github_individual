import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';


// ============================================================
// CONFIGURAÇÃO DA API
// ============================================================

// EMULADOR ANDROID
// 10.0.2.2 = computador onde o Flask está rodando

const API_BASE_URL = 'http://10.0.2.2:5000';


// ============================================================
// API DO DASHBOARD
// ============================================================
//
// ESTA API CONTINUA SENDO A RESPONSÁVEL PELOS DADOS
// PRINCIPAIS DA HOME.
//
// NÃO FOI ALTERADA.
//
// ============================================================

const API_DASHBOARD =
  `${API_BASE_URL}/api/dashboard`;


// ============================================================
// API DE MOVIMENTAÇÕES
// ============================================================
//
// USADA SOMENTE PARA A BUSCA.
//
// ============================================================

const API_MOVIMENTACOES =
  `${API_BASE_URL}/api/movimentacoes`;


// ============================================================
// CORES
// ============================================================

const C = {
  bg: '#F5F8FA',
  card: '#FFFFFF',
  border: '#E6ECF1',

  deep: '#123A73',
  brand: '#12B5B0',

  text: '#1B2A41',
  muted: '#7B8AA0',

  warnBg: '#FFF6E5',
  warn: '#E0A020',

  white: '#FFFFFF',

  green: '#22A55B',
  red: '#EF4444',
};


// ============================================================
// FLUXO
// ============================================================

const FLOW = [
  {
    icon: 'truck-outline',
    title: 'Receber',
    desc: 'Entrada do fornecedor',
  },
  {
    icon: 'cube-outline',
    title: 'Armazenar',
    desc: 'Estoque e produtos',
  },
  {
    icon: 'account-group-outline',
    title: 'Distribuir',
    desc: 'Saída ao cliente',
  },
];


// ============================================================
// FUNÇÃO PARA NÚMEROS
// ============================================================

const numero = (valor) => {
  const n = Number(valor);

  if (Number.isNaN(n)) {
    return 0;
  }

  return n;
};


// ============================================================
// TELA HOME
// ============================================================

export default function telaHome({
  navigation,
  route,
}) {

  // ==========================================================
  // CLIENTE LOGADO
  // ==========================================================

  const cliente =
    route?.params?.cliente ||
    route?.params?.usuario ||
    route?.params?.user ||
    null;


  // ==========================================================
  // ESTADOS DO DASHBOARD
  // ==========================================================

  const [dados, setDados] = useState(null);

  const [carregando, setCarregando] =
    useState(true);

  const [atualizando, setAtualizando] =
    useState(false);

  const [erro, setErro] =
    useState(null);


  // ==========================================================
  // ESTADOS DA BUSCA
  // ==========================================================

  const [busca, setBusca] =
    useState('');

  const [produtosBusca, setProdutosBusca] =
    useState([]);

  const [clientesBusca, setClientesBusca] =
    useState([]);

  const [buscando, setBuscando] =
    useState(false);


  // ==========================================================
  // DEBUG CLIENTE
  // ==========================================================

  useEffect(() => {

    console.log(
      '===================================='
    );

    console.log(
      'CLIENTE RECEBIDO NA HOME:'
    );

    console.log(cliente);

    console.log(
      '===================================='
    );

  }, [cliente]);


  // ==========================================================
  // BUSCAR DADOS DO DASHBOARD
  // ==========================================================
  //
  // IMPORTANTE:
  //
  // ESTA PARTE CONTINUA USANDO:
  //
  // /api/dashboard
  //
  // Ela NÃO usa /api/movimentacoes.
  //
  // ==========================================================

  const carregarDados = useCallback(
    async (mostrarLoading = true) => {

      try {

        if (mostrarLoading) {
          setCarregando(true);
        }

        setErro(null);


        console.log(
          '===================================='
        );

        console.log(
          'CONSULTANDO API DO DASHBOARD'
        );

        console.log(
          'URL:',
          API_DASHBOARD
        );

        console.log(
          '===================================='
        );


        const resposta =
          await fetch(
            API_DASHBOARD,
            {
              method: 'GET',

              headers: {
                Accept: 'application/json',
              },
            }
          );


        if (!resposta.ok) {

          throw new Error(
            `Erro HTTP ${resposta.status}`
          );

        }


        const json =
          await resposta.json();


        console.log(
          '===================================='
        );

        console.log(
          'DADOS RECEBIDOS DO DASHBOARD:'
        );

        console.log(json);

        console.log(
          '===================================='
        );


        if (!json.sucesso) {

          throw new Error(
            json.erro ||
            'A API retornou um erro.'
          );

        }


        setDados(json);


      } catch (error) {

        console.log(
          '===================================='
        );

        console.log(
          'ERRO API DASHBOARD:'
        );

        console.log(error);

        console.log(
          '===================================='
        );


        setErro(
          'Não foi possível conectar ao sistema desktop.'
        );


      } finally {

        setCarregando(false);

        setAtualizando(false);

      }

    },
    []
  );


  // ==========================================================
  // CARREGAR DASHBOARD AO ABRIR
  // ==========================================================

  useEffect(() => {

    carregarDados(true);

  }, [carregarDados]);


  // ==========================================================
  // ATUALIZAR DASHBOARD
  // ==========================================================

  const atualizar = async () => {

    if (atualizando) {
      return;
    }

    setAtualizando(true);

    await carregarDados(false);

  };


  // ==========================================================
  // BUSCA
  // ==========================================================
  //
  // A BUSCA USA SOMENTE:
  //
  // /api/movimentacoes
  //
  // Não altera a API do dashboard.
  //
  // ==========================================================

  const executarBusca = useCallback(
    async (texto) => {

      const termo =
        String(texto || '')
          .trim()
          .toLowerCase();


      // ======================================================
      // BUSCA VAZIA
      // ======================================================

      if (!termo) {

        setProdutosBusca([]);

        setClientesBusca([]);

        setBuscando(false);

        return;
      }


      setBuscando(true);


      try {

        console.log(
          '===================================='
        );

        console.log(
          'BUSCA NA HOME'
        );

        console.log(
          'Termo:',
          termo
        );

        console.log(
          'URL:',
          API_MOVIMENTACOES
        );

        console.log(
          '===================================='
        );


        // ====================================================
        // CONSULTAR MOVIMENTAÇÕES
        // ====================================================

        const resposta =
          await fetch(
            API_MOVIMENTACOES,
            {
              method: 'GET',

              headers: {
                Accept: 'application/json',
              },
            }
          );


        if (!resposta.ok) {

          throw new Error(
            `Erro HTTP ${resposta.status}`
          );

        }


        const json =
          await resposta.json();


        console.log(
          '===================================='
        );

        console.log(
          'DADOS DA BUSCA:'
        );

        console.log(json);

        console.log(
          '===================================='
        );


        if (!json.sucesso) {

          throw new Error(
            json.erro ||
            'Erro ao consultar movimentações.'
          );

        }


        const movimentacoes =
          Array.isArray(
            json.movimentacoes
          )
            ? json.movimentacoes
            : [];


        // ====================================================
        // FILTRAR RESULTADOS
        // ====================================================

        const resultados =
          movimentacoes.filter(
            (item) => {

              const produto =
                String(
                  item?.produto || ''
                ).toLowerCase();


              const parceiro =
                String(
                  item?.parceiro || ''
                ).toLowerCase();


              const tipo =
                String(
                  item?.tipo || ''
                ).toLowerCase();


              const quantidade =
                String(
                  item?.quantidade || ''
                ).toLowerCase();


              const data =
                String(
                  item?.data || ''
                ).toLowerCase();


              return (
                produto.includes(termo) ||
                parceiro.includes(termo) ||
                tipo.includes(termo) ||
                quantidade.includes(termo) ||
                data.includes(termo)
              );

            }
          );


        // ====================================================
        // LIMITAR RESULTADOS
        // ====================================================

        const resultadosLimitados =
          resultados.slice(0, 8);


        console.log(
          'RESULTADOS ENCONTRADOS:',
          resultadosLimitados
        );


        // ====================================================
        // RESULTADOS
        // ====================================================

        setProdutosBusca(
          resultadosLimitados
        );


        // O parceiro da saída já vem como cliente
        // dentro das movimentações.

        setClientesBusca([]);


      } catch (error) {

        console.log(
          '===================================='
        );

        console.log(
          'ERRO NA BUSCA:'
        );

        console.log(error);

        console.log(
          '===================================='
        );


        setProdutosBusca([]);

        setClientesBusca([]);


      } finally {

        setBuscando(false);

      }

    },
    []
  );


  // ==========================================================
  // ALTERAR BUSCA
  // ==========================================================

  const alterarBusca = (texto) => {

    setBusca(texto);


    if (!texto.trim()) {

      setProdutosBusca([]);

      setClientesBusca([]);

      return;

    }


    executarBusca(texto);

  };


  // ==========================================================
  // ABRIR RESULTADO DA BUSCA
  // ==========================================================

  const abrirProduto = (movimentacao) => {

    console.log(
      '===================================='
    );

    console.log(
      'MOVIMENTAÇÃO SELECIONADA:'
    );

    console.log(movimentacao);

    console.log(
      '===================================='
    );


    // Limpar busca

    setBusca('');

    setProdutosBusca([]);

    setClientesBusca([]);


    // Abrir a aba de movimentação

    navigation.navigate(
      'mov',
      {
        cliente: cliente,
        usuario: cliente,
        user: cliente,
        movimentacaoSelecionada:
          movimentacao,
      }
    );

  };


  // ==========================================================
  // NAVEGAÇÃO
  // ==========================================================

  const navegar = (
    rota,
    parametrosExtras = {}
  ) => {

    if (!rota) {
      return;
    }


    console.log(
      '===================================='
    );

    console.log(
      'NAVEGANDO NA HOME'
    );

    console.log(
      'Rota:',
      rota
    );

    console.log(
      'Cliente:',
      cliente
    );

    console.log(
      '===================================='
    );


    const parametros = {

      cliente: cliente,

      usuario: cliente,

      user: cliente,

      ...parametrosExtras,

    };


    navigation.navigate(
      rota,
      parametros
    );

  };


  // ==========================================================
  // VALORES DO DASHBOARD
  // ==========================================================

  const totalProdutos =
    numero(
      dados?.totalProdutos
    );


  const entradasPendentes =
    numero(
      dados?.pedidosEntrada?.pendentes
    );


  const saidasPendentes =
    numero(
      dados?.pedidosSaida?.pendentes
    );


  // ==========================================================
  // PRODUTOS CRÍTICOS
  // ==========================================================

  const produtosCriticos =
    Array.isArray(
      dados?.produtosCriticos
    )
      ? dados.produtosCriticos
      : [];


  // ==========================================================
  // PRODUTOS BAIXOS
  // ==========================================================

  const produtosBaixo =
    Array.isArray(
      dados?.produtosBaixo
    )
      ? dados.produtosBaixo
      : [];


  // ==========================================================
  // QUANTIDADE DE ALERTAS
  // ==========================================================

  const quantidadeAlertas =
    produtosCriticos.length +
    produtosBaixo.length;


  // ==========================================================
  // TEXTO DO ALERTA
  // ==========================================================

  let textoAlerta =
    'O estoque está funcionando normalmente.';


  if (
    produtosCriticos.length > 0
  ) {

    textoAlerta =
      `${produtosCriticos.length} produto(s) em estoque crítico — revise o estoque.`;

  } else if (
    produtosBaixo.length > 0
  ) {

    textoAlerta =
      `${produtosBaixo.length} produto(s) com estoque baixo — revise o estoque.`;

  }


  // ==========================================================
  // STATUS DO SISTEMA
  // ==========================================================

  const sistemaOnline =
    dados?.sucesso === true;


  // ==========================================================
  // LOADING
  // ==========================================================

  if (
    carregando &&
    !dados
  ) {

    return (

      <SafeAreaView
        style={styles.safe}
      >

        <StatusBar
          barStyle="dark-content"
          backgroundColor={C.bg}
        />


        <View
          style={
            styles.loadingContainer
          }
        >

          <LinearGradient
            colors={[
              C.deep,
              C.brand,
            ]}
            start={{
              x: 0,
              y: 0,
            }}
            end={{
              x: 1,
              y: 1,
            }}
            style={
              styles.loadingIcon
            }
          >

            <MaterialCommunityIcons
              name="medical-bag"
              size={34}
              color={C.white}
            />

          </LinearGradient>


          <Text
            style={
              styles.loadingTitle
            }
          >
            MEDSTOCK
          </Text>


          <Text
            style={
              styles.loadingText
            }
          >
            Carregando informações...
          </Text>


          <ActivityIndicator
            size="large"
            color={C.brand}
            style={{
              marginTop: 18,
            }}
          />

        </View>

      </SafeAreaView>

    );

  }


  // ==========================================================
  // TELA PRINCIPAL
  // ==========================================================

  return (

    <SafeAreaView
      style={styles.safe}
    >

      <StatusBar
        barStyle="dark-content"
        backgroundColor={C.bg}
      />


      <ScrollView
        contentContainerStyle={
          styles.scroll
        }
        showsVerticalScrollIndicator={
          false
        }
      >


        {/* ==================================================
            BARRA SUPERIOR
        ================================================== */}

        <View
          style={styles.topbar}
        >

          <View
            style={{
              flex: 1,
            }}
          >

            <Text
              style={styles.topLabel}
            >
              PAINEL GERAL
            </Text>


            <Text
              style={styles.topTitle}
            >
              MEDSTOCK
            </Text>

          </View>


          {/* ATUALIZAR */}

          <TouchableOpacity
            style={styles.iconBtn}
            activeOpacity={0.8}
            onPress={atualizar}
            disabled={atualizando}
          >

            {atualizando ? (

              <ActivityIndicator
                size="small"
                color={C.deep}
              />

            ) : (

              <Feather
                name="refresh-cw"
                size={19}
                color={C.deep}
              />

            )}

          </TouchableOpacity>


          {/* NOTIFICAÇÃO */}

          <TouchableOpacity
            style={styles.iconBtn}
            activeOpacity={0.8}
          >

            <Feather
              name="bell"
              size={20}
              color={C.deep}
            />


            {quantidadeAlertas > 0 && (

              <View
                style={styles.dot}
              />

            )}

          </TouchableOpacity>

        </View>


        {/* ==================================================
            ERRO
        ================================================== */}

        {erro && (

          <View
            style={styles.errorBox}
          >

            <Ionicons
              name="cloud-offline-outline"
              size={20}
              color={C.red}
            />


            <View
              style={{
                flex: 1,
              }}
            >

              <Text
                style={styles.errorTitle}
              >
                Sistema desktop indisponível
              </Text>


              <Text
                style={styles.errorText}
              >
                {erro}
              </Text>

            </View>


            <TouchableOpacity
              onPress={() =>
                carregarDados(true)
              }
              style={
                styles.retryButton
              }
            >

              <Text
                style={styles.retryText}
              >
                Tentar
              </Text>

            </TouchableOpacity>

          </View>

        )}


        {/* ==================================================
            HERO
        ================================================== */}

        <LinearGradient
          colors={[
            C.deep,
            C.brand,
          ]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={styles.hero}
        >


          {/* STATUS */}

          <View
            style={styles.badge}
          >

            <View
              style={[
                styles.badgeDot,
                {
                  backgroundColor:
                    sistemaOnline
                      ? '#7CFFB2'
                      : '#FF7070',
                },
              ]}
            />


            <Text
              style={styles.badgeText}
            >

              {sistemaOnline
                ? 'SISTEMA ON-LINE'
                : 'SISTEMA OFF-LINE'}

            </Text>

          </View>


          {/* TÍTULO */}

          <Text
            style={styles.heroTitle}
          >
            Bem-vindo à MEDSTOCK
          </Text>


          <Text
            style={styles.heroSub}
          >
            Gestão inteligente de estoque hospitalar e clínico.
          </Text>


          {/* ==================================================
              BUSCA
          ================================================== */}

          <View
            style={styles.search}
          >

            <Feather
              name="search"
              size={16}
              color="rgba(255,255,255,0.85)"
            />


            <TextInput
              placeholder="Buscar produto ou cliente"
              placeholderTextColor="rgba(255,255,255,0.8)"
              style={styles.searchInput}
              value={busca}
              onChangeText={alterarBusca}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />


            {busca.length > 0 && (

              <TouchableOpacity
                onPress={() => {

                  setBusca('');

                  setProdutosBusca([]);

                  setClientesBusca([]);

                }}
                activeOpacity={0.7}
              >

                <Feather
                  name="x"
                  size={17}
                  color="rgba(255,255,255,0.85)"
                />

              </TouchableOpacity>

            )}

          </View>


          {/* ==================================================
              CARREGANDO BUSCA
          ================================================== */}

          {buscando && (

            <View
              style={styles.searchLoading}
            >

              <ActivityIndicator
                size="small"
                color={C.deep}
              />

              <Text
                style={
                  styles.searchLoadingText
                }
              >
                Pesquisando...
              </Text>

            </View>

          )}


          {/* ==================================================
              RESULTADOS DA BUSCA
          ================================================== */}

          {!buscando &&
            busca.trim().length > 0 && (

              <View
                style={
                  styles.searchResults
                }
              >

                {produtosBusca.length > 0 ? (

                  <>

                    <Text
                      style={
                        styles.searchCategory
                      }
                    >
                      RESULTADOS ENCONTRADOS
                    </Text>


                    {produtosBusca.map(
                      (item, index) => {

                        const tipo =
                          String(
                            item?.tipo || ''
                          ).toLowerCase();


                        const entrada =
                          tipo === 'entrada';


                        return (

                          <TouchableOpacity
                            key={
                              `${item?.id || 'item'}-${index}`
                            }
                            style={
                              styles.searchItem
                            }
                            activeOpacity={0.75}
                            onPress={() =>
                              abrirProduto(item)
                            }
                          >

                            <View
                              style={
                                styles.searchItemIcon
                              }
                            >

                              <MaterialCommunityIcons
                                name={
                                  entrada
                                    ? 'package-down'
                                    : 'package-up'
                                }
                                size={20}
                                color={C.deep}
                              />

                            </View>


                            <View
                              style={{
                                flex: 1,
                              }}
                            >

                              <Text
                                numberOfLines={1}
                                style={
                                  styles.searchItemTitle
                                }
                              >
                                {item?.produto ||
                                  'Produto não encontrado'}
                              </Text>


                              <Text
                                numberOfLines={1}
                                style={
                                  styles.searchItemPartner
                                }
                              >
                                {item?.parceiro ||
                                  'Não informado'}
                              </Text>


                              <Text
                                style={
                                  styles.searchItemInfo
                                }
                              >

                                {item?.tipo ||
                                  ''}

                                {' • '}

                                {item?.data ||
                                  ''}

                                {' • Qtd: '}

                                {item?.quantidade ??
                                  0}

                              </Text>

                            </View>


                            <Feather
                              name="chevron-right"
                              size={18}
                              color={C.muted}
                            />

                          </TouchableOpacity>

                        );

                      }
                    )}

                  </>

                ) : (

                  <View
                    style={
                      styles.noResults
                    }
                  >

                    <Feather
                      name="search"
                      size={24}
                      color={C.muted}
                    />


                    <Text
                      style={
                        styles.noResultsTitle
                      }
                    >
                      Nenhum resultado
                    </Text>


                    <Text
                      style={
                        styles.noResultsText
                      }
                    >
                      Não encontramos produto ou cliente com esse nome.
                    </Text>

                  </View>

                )}

              </View>

            )}

        </LinearGradient>


        {/* ==================================================
            FLUXO DO PRODUTO
        ================================================== */}

        <Text
          style={styles.section}
        >
          FLUXO DO PRODUTO
        </Text>


        <View
          style={styles.flowRow}
        >

          {FLOW.map((item) => (

            <View
              key={item.title}
              style={styles.flowCard}
            >

              <View
                style={styles.flowIcon}
              >

                <MaterialCommunityIcons
                  name={item.icon}
                  size={18}
                  color={C.deep}
                />

              </View>


              <Text
                style={styles.flowTitle}
              >
                {item.title}
              </Text>


              <Text
                style={styles.flowDesc}
              >
                {item.desc}
              </Text>

            </View>

          ))}

        </View>


        {/* ==================================================
            MÉTRICAS
        ================================================== */}

        <View
          style={styles.metricsContainer}
        >

          {/* PRODUTOS */}

          <View
            style={styles.metricCard}
          >

            <LinearGradient
              colors={[
                C.deep,
                C.brand,
              ]}
              start={{
                x: 0,
                y: 0,
              }}
              end={{
                x: 1,
                y: 1,
              }}
              style={styles.metricIcon}
            >

              <MaterialCommunityIcons
                name="pill"
                size={22}
                color={C.white}
              />

            </LinearGradient>


            <View
              style={{
                flex: 1,
              }}
            >

              <Text
                style={styles.metricLabel}
              >
                Produtos cadastrados
              </Text>


              <Text
                style={styles.metricValue}
              >
                {totalProdutos}
              </Text>


              <Text
                style={styles.metricHint}
              >
                Catálogo de insumos
              </Text>

            </View>

          </View>


          {/* ENTRADAS */}

          <View
            style={styles.metricCard}
          >

            <LinearGradient
              colors={[
                C.deep,
                C.brand,
              ]}
              start={{
                x: 0,
                y: 0,
              }}
              end={{
                x: 1,
                y: 1,
              }}
              style={styles.metricIcon}
            >

              <MaterialCommunityIcons
                name="package-down"
                size={22}
                color={C.white}
              />

            </LinearGradient>


            <View
              style={{
                flex: 1,
              }}
            >

              <Text
                style={styles.metricLabel}
              >
                Entradas em espera
              </Text>


              <Text
                style={styles.metricValue}
              >
                {entradasPendentes}
              </Text>


              <Text
                style={styles.metricHint}
              >
                Pedidos a confirmar
              </Text>

            </View>

          </View>


          {/* SAÍDAS */}

          <View
            style={styles.metricCard}
          >

            <LinearGradient
              colors={[
                C.deep,
                C.brand,
              ]}
              start={{
                x: 0,
                y: 0,
              }}
              end={{
                x: 1,
                y: 1,
              }}
              style={styles.metricIcon}
            >

              <MaterialCommunityIcons
                name="package-up"
                size={22}
                color={C.white}
              />

            </LinearGradient>


            <View
              style={{
                flex: 1,
              }}
            >

              <Text
                style={styles.metricLabel}
              >
                Saídas em espera
              </Text>


              <Text
                style={styles.metricValue}
              >
                {saidasPendentes}
              </Text>


              <Text
                style={styles.metricHint}
              >
                Pedidos a faturar
              </Text>

            </View>

          </View>

        </View>


        {/* ==================================================
            ALERTA
        ================================================== */}

        <View
          style={[
            styles.alert,

            quantidadeAlertas === 0 &&
              styles.alertNormal,
          ]}
        >

          <Ionicons
            name={
              quantidadeAlertas > 0
                ? 'warning-outline'
                : 'checkmark-circle-outline'
            }
            size={18}
            color={
              quantidadeAlertas > 0
                ? C.warn
                : C.green
            }
          />


          <Text
            style={styles.alertText}
          >
            {textoAlerta}
          </Text>

        </View>


        {/* ==================================================
            BOTÃO DASHBOARD
        ================================================== */}

        <TouchableOpacity
          style={styles.cta}
          activeOpacity={0.85}
          onPress={() =>
            navegar('Dashboard')
          }
        >

          <Text
            style={styles.ctaText}
          >
            Ver dashboard completo
          </Text>


          <Feather
            name="arrow-right"
            size={16}
            color={C.white}
          />

        </TouchableOpacity>


        {/* ==================================================
            RODAPÉ
        ================================================== */}

        <Text
          style={styles.footer}
        >
          Medstock · Controle de estoque
        </Text>


      </ScrollView>

      {/*
        ======================================================
        IMPORTANTE

        O Bottom Tab não fica mais aqui.

        Ele será criado no App.js usando:

        createBottomTabNavigator()

        Portanto a Home termina aqui.
        ======================================================
      */}

    </SafeAreaView>

  );

}


// ============================================================
// ESTILO DOS CARDS
// ============================================================

const cardStyle = {

  backgroundColor: C.card,

  borderRadius: 18,

  borderWidth: 1,

  borderColor: C.border,

  shadowColor: '#123A73',

  shadowOpacity: 0.08,

  shadowRadius: 12,

  shadowOffset: {
    width: 0,
    height: 6,
  },

  elevation: 2,

};


// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },


  // ========================================================
  // SCROLL
  // ========================================================

  scroll: {
    padding: 20,

    // Espaço para o BottomTabNavigator
    paddingBottom: 35,

    gap: 22,
  },


  // ========================================================
  // LOADING
  // ========================================================

  loadingContainer: {
    flex: 1,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 30,
  },

  loadingIcon: {
    width: 70,
    height: 70,

    borderRadius: 22,

    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingTitle: {
    fontSize: 22,

    fontWeight: '800',

    color: C.deep,

    marginTop: 14,
  },

  loadingText: {
    fontSize: 13,

    color: C.muted,

    marginTop: 4,
  },


  // ========================================================
  // ERRO
  // ========================================================

  errorBox: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 10,

    backgroundColor: '#FFF0F0',

    borderWidth: 1,

    borderColor: '#FFD2D2',

    borderRadius: 16,

    padding: 12,

    marginTop: 4,
  },

  errorTitle: {
    fontSize: 12,

    fontWeight: '700',

    color: '#B42318',
  },

  errorText: {
    fontSize: 11,

    color: '#7A271A',

    marginTop: 2,
  },

  retryButton: {
    backgroundColor: C.red,

    paddingHorizontal: 10,

    paddingVertical: 7,

    borderRadius: 9,
  },

  retryText: {
    color: C.white,

    fontSize: 11,

    fontWeight: '700',
  },


  // ========================================================
  // BARRA SUPERIOR
  // ========================================================

  topbar: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 10,
  },

  iconBtn: {
    width: 45,
    height: 45,

    borderRadius: 14,

    backgroundColor: '#E9F2F5',

    alignItems: 'center',

    justifyContent: 'center',
  },

  dot: {
    position: 'absolute',

    top: 8,
    right: 8,

    width: 8,
    height: 8,

    borderRadius: 4,

    backgroundColor: C.red,

    borderWidth: 1,

    borderColor: C.white,
  },

  topLabel: {
    fontSize: 12,

    letterSpacing: 1.5,

    color: C.muted,

    fontWeight: '600',
  },

  topTitle: {
    fontSize: 17,

    fontWeight: '700',

    color: C.text,
  },


  // ========================================================
  // HERO
  // ========================================================

  hero: {
    borderRadius: 26,

    padding: 17,

    overflow: 'visible',

    zIndex: 10,
  },

  badge: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 6,

    alignSelf: 'flex-start',

    backgroundColor:
      'rgba(255,255,255,0.18)',

    paddingHorizontal: 12,

    paddingVertical: 5,

    borderRadius: 999,
  },

  badgeDot: {
    width: 6,
    height: 6,

    borderRadius: 3,
  },

  badgeText: {
    color: C.white,

    fontSize: 11,

    fontWeight: '700',

    letterSpacing: 1.2,
  },

  heroTitle: {
    color: C.white,

    fontSize: 27,

    fontWeight: '800',

    marginTop: 12,
  },

  heroSub: {
    color:
      'rgba(255,255,255,0.85)',

    fontSize: 15,

    marginTop: 4,
  },


  // ========================================================
  // BUSCA
  // ========================================================

  search: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,

    marginTop: 16,

    backgroundColor:
      'rgba(255,255,255,0.16)',

    borderRadius: 16,

    paddingHorizontal: 13,

    paddingVertical: 14,
  },

  searchInput: {
    flex: 1,

    color: C.white,

    fontSize: 15,

    padding: 0,
  },


  // ========================================================
  // CARREGANDO BUSCA
  // ========================================================

  searchLoading: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,

    marginTop: 8,

    backgroundColor: C.white,

    borderRadius: 14,

    paddingHorizontal: 14,

    paddingVertical: 12,
  },

  searchLoadingText: {
    fontSize: 12,

    color: C.muted,
  },


  // ========================================================
  // RESULTADOS
  // ========================================================

  searchResults: {
    marginTop: 8,

    backgroundColor: C.white,

    borderRadius: 16,

    padding: 8,

    overflow: 'hidden',

    shadowColor: '#000',

    shadowOpacity: 0.15,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 8,
  },

  searchCategory: {
    fontSize: 13,

    fontWeight: '800',

    letterSpacing: 1.1,

    color: C.muted,

    paddingHorizontal: 8,

    paddingTop: 5,

    paddingBottom: 7,
  },

  searchItem: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 10,

    paddingHorizontal: 8,

    paddingVertical: 10,

    borderTopWidth: 1,

    borderTopColor: C.border,
  },

  searchItemIcon: {
    width: 45,
    height: 45,

    borderRadius: 12,

    backgroundColor: '#EAF4F6',

    alignItems: 'center',

    justifyContent: 'center',
  },

  searchItemTitle: {
    fontSize: 17,

    fontWeight: '700',

    color: C.deep,
  },

  searchItemPartner: {
    fontSize: 15,

    color: C.text,

    marginTop: 2,
  },

  searchItemInfo: {
    fontSize: 13.5,

    color: C.muted,

    marginTop: 3,
  },

  noResults: {
    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 15,

    paddingVertical: 20,
  },

  noResultsTitle: {
    fontSize: 14,

    fontWeight: '700',

    color: C.text,

    marginTop: 7,
  },

  noResultsText: {
    fontSize: 11,

    color: C.muted,

    textAlign: 'center',

    marginTop: 3,
  },


  // ========================================================
  // SEÇÃO
  // ========================================================

  section: {
    fontSize: 12,

    letterSpacing: 1.4,

    fontWeight: '700',

    color: C.muted,
  },


  // ========================================================
  // FLUXO
  // ========================================================

  flowRow: {
    flexDirection: 'row',

    gap: 10,

    marginTop: -12,
  },

  flowCard: {
    ...cardStyle,

    flex: 1,

    padding: 12,

    alignItems: 'center',
  },

  flowIcon: {
    width: 36,
    height: 36,

    borderRadius: 12,

    backgroundColor: '#E9F5F6',

    alignItems: 'center',

    justifyContent: 'center',
  },

  flowTitle: {
    fontSize: 16,

    fontWeight: '700',

    color: C.text,

    marginTop: 8,
  },

  flowDesc: {
    fontSize: 14,

    color: C.muted,

    textAlign: 'center',

    marginTop: 2,
  },


  // ========================================================
  // MÉTRICAS
  // ========================================================

  metricsContainer: {
    gap: 12,
  },

  metricCard: {
    ...cardStyle,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 14,

    padding: 15,
  },

  metricIcon: {
    width: 48,
    height: 48,

    borderRadius: 16,

    alignItems: 'center',

    justifyContent: 'center',
  },

  metricLabel: {
    fontSize: 15,

    color: C.muted,
  },

  metricValue: {
    fontSize: 26,

    fontWeight: '800',

    color: C.deep,

    marginTop: 2,
  },

  metricHint: {
    fontSize: 13,

    color: C.muted,

    marginTop: 2,
  },


  // ========================================================
  // ALERTA
  // ========================================================

  alert: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,

    backgroundColor: '#ffdcdc',

    borderColor: '#f2aeae',

    borderWidth: 1,

    borderRadius: 16,

    padding: 15,

    marginTop: -10,
  },

  alertNormal: {
    backgroundColor: '#ECFDF3',

    borderColor: '#B7E4C7',
  },

  alertText: {
    flex: 1,

    fontSize: 16,

    color: C.text,
  },


  // ========================================================
  // BOTÃO DASHBOARD
  // ========================================================

  cta: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 8,

    backgroundColor: C.deep,

    borderRadius: 16,

    paddingVertical: 15,

    marginTop: -10,
  },

  ctaText: {
    color: C.white,

    fontWeight: '700',

    fontSize: 17.5,
  },


  // ========================================================
  // RODAPÉ
  // ========================================================

  footer: {
    textAlign: 'center',

    fontSize: 11.5,

    color: C.muted,

    marginTop: 2,
  },

});
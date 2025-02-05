
// he elegido como país de testeo el rol del país de bowl ya que nadie lo tiene y nunca se borro
// 1268370831994785852

/**
basic stats:
literacy
infamy
instability
prestigeattrition
intelagencylevel
intelagencyxp
intelagencyxpneed
literacy_growth

others:
news_channel_id
literacy_hard_limit
default_literacy_gain_per_year
max_intel_xp_gain_per_year
xp_global_multiplier
year
day
month
 */

const { addData, setData, getData } = require('./DatabaseManager.js');

(async () => {
  await addData('1268370831994785852', 'intelagencyxp', 34); // suma 10 a "xp"
  await setData('1268370831994785852', 'intelagencylevel', 5); // pone el nivel de intelagencylevel en 5
  const xp = await getData('1268370831994785852', 'intelagencyxp', 35); // obtiene el valor, si el valor no existe el valor por defecto es el número 35 por ejemplo
  console.log(`1268370831994785852 intelagencyxp: ${xp}`);
})();
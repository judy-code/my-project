/**
 * @param {{salary?: number|string, salaryUnit?: string, salaryMinus?: number|string}} card
 * @returns {string} e.g. "期待 NT$ 120 萬/年薪，最低不可低於 NT$ 108 萬/年薪"
 */
export function getSalaryHint({ salary, salaryUnit = '年薪', salaryMinus = 0 } = {}) {
  const base = parseFloat(salary) || 0
  if (!base) return ''
  const minus = parseInt(salaryMinus, 10) || 0
  const suffix = salaryUnit === '時薪' ? '/時' : salaryUnit === '按件計酬' ? '/件' : `萬/${salaryUnit}`
  let main = `期待 NT$ ${base} ${suffix}`
  if (minus > 0) {
    const low = Math.round(base * (1 - minus / 100) * 10) / 10
    main += `，最低不可低於 NT$ ${low} ${suffix}`
  }
  return main
}

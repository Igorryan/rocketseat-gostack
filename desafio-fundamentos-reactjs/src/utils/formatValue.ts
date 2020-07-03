const formatValue = (value: number): string =>
  Intl.NumberFormat('br-IN', { style: 'currency', currency: 'BRL' }).format(
    value,
  ); // TODO

export default formatValue;

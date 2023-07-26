const data = [];

console.log(
  JSON.stringify(
    data.map((dataOne) => {
      return {
        event: {
          ...dataOne,
        },
        collections: {},
      };
    })
  )
);

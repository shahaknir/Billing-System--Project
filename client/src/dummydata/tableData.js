export const columns = [
    {
      name: "first_name",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "last_name",
      selector: (row) => row.year,
      sortable: true,
    },
    {
      name: "email",
      selector: (row) => row.year,
      sortable: true,
    },
    {
      name: "mobile",
      selector: (row) => row.year,
      sortable: true,
    },
    {
      name: "username",
      selector: (row) => row.year,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <button className="btn btn-primary" onClick={() => console.log(row.id)}>
          Edit
        </button>
      ),
    },
  ];

  export const data = [
    {
      id: 1,
      title: "Beetlejuice",
      year: "1988",
    },
    {
      id: 2,
      title: "Ghostbusters",
      year: "1984",
    },
    {
      id: 3,
      title: "Ghostbusters",
      year: "1984",
    },
    {
      id: 4,
      title: "Ghostbusters",
      year: "1984",
    },
    {
      id: 5,
      title: "Ghostbusters",
      year: "1984",
    },
    {
      id: 6,
      title: "Ghostbusters",
      year: "1984",
    },
    {
      id: 7,
      title: "Ghostbusters",
      year: "1984",
    },
    {
      id: 8,
      title: "Ghostbusters",
      year: "1984",
    },
    {
      id: 9,
      title: "Ghostbusters",
      year: "1984",
    },
    {
      id: 10,
      title: "Ghostbusters",
      year: "1984",
    },
    {
      id: 11,
      title: "Ghostbusters",
      year: "1984",
    },
    {
      id: 12,
      title: "Ghostbusters",
      year: "1984",
    },
    {
      id: 13,
      title: "Ghostbusters",
      year: "1984",
    },
    {
      id: 5542,
      title: "Ghostbusters",
      year: "1984",
    },
    {
      id: 54452,
      title: "Ghostbusters",
      year: "1984",
    },
    {
      id: 5562,
      title: "Ghostbusters",
      year: "1984",
    },
    {
      id: 552,
      title: "Ghostbusters",
      year: "1984",
    },
    {
      id: 87552,
      title: "Ghostbusters",
      year: "1984",
    },
  ];
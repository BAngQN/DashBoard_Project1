# Avoid using useEffect when possible

https://react.dev/learn/you-might-not-need-an-effect

HomePage.tsx

```typescript
const [searchTerm, setSearchTerm] = useState('');

// Reset page to 1 when search term changes
useEffect(() => {
  setPagination((prev) => ({ ...prev, page: 1 }));
  localStorage.setItem('currentPage', '1');
}, [searchTerm]);
```

Solution: handle page change directly in handleSearch

```typescript
const handleSearch = (searchKey: string) => {
  setSearchTerm(searchKey);
  handlePageChange(1);
};
```

# Should not define functions initialPage, totalPages for initiating pagination state

```typescript
const initialPage = () => {
  const saved = localStorage.getItem('currentPage');
  const parsed = saved ? parseInt(saved, 10) : 1;
  return isNaN(parsed) || parsed < 1 ? 1 : parsed;
};

const totalPages = () => {
  const savedTotal = localStorage.getItem('totalPages');
  const parsedTotal = savedTotal ? parseInt(savedTotal, 10) : 0;
  return isNaN(parsedTotal) || parsedTotal < 1 ? 0 : parsedTotal;
};
const [pagination, setPagination] = useState({
  page: initialPage(),
  limit: 10,
  totalPages: totalPages(),
});
```

Solution: use lazy initialization with callback

```typescript
const [pagination, setPagination] = useState(() => {
  const savedCurrentPage = localStorage.getItem('currentPage');
  const savedTotalPages = localStorage.getItem('totalPages');

  const page = savedCurrentPage ? parseInt(savedCurrentPage, 10) : 1;
  const totalPages = savedTotalPages ? parseInt(savedTotalPages, 10) : 0;

  return {
    page: isNaN(page) || page < 1 ? 1 : page,
    limit: 10,
    totalPages: isNaN(totalPages) || totalPages < 1 ? 0 : totalPages,
  };
});
```

# Split code into smaller reuseable components

- Pagination component

# Reuse logic with custom hooks

- Extract logic to custom hook from a component: https://react.dev/learn/reusing-logic-with-custom-hooks

In ProductForm

=>

useProductForm.ts

```typescript
const useProductForm = () => {
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>(
    previousData?.specifications
      ? Object.entries(previousData.specifications).map(([key, value]) => ({
          key,
          value,
        }))
      : [],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewProduct>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
    defaultValues: previousData || {
      name: '',
      brand: '',
      description: '',
      category: PRODUCT_TYPES[0],
      quantity: 0,
      price: 0,
      imgUrl: '',
      specifications: {},
    },
  });

  const addSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: 'key' | 'value', val: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = val;
    setSpecs(newSpecs);
  };

  const onSubmitForm: SubmitHandler<NewProduct> = (data) => {
    const specifications = specs.reduce(
      (acc, spec) => {
        if (spec.key.trim() && spec.value.trim()) {
          acc[spec.key.trim()] = spec.value.trim();
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    onSubmit({ ...data, specifications });
  };

  return {
    specs,
    register,
    handleSubmit,
    formState,
    addSpec,
    removeSpec,
    updateSpec,
    onSubmitForm,
  };
};
```

ProductForm.index.tsx

```typescript
const { specs, onSubmitForm, addSpec, removeSpec, updateSpec } =
  useProductForm();
```

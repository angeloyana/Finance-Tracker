import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import { createCategory, deleteCategory, getCategories, updateCategory } from '@/lib/db';
import type { CreateCategoryData, UpdateCategoryData } from '@/schemas/categories';
import type { Category } from '@/types/categories';

import CategoriesFAB from './components/CategoriesFAB';
import CategoriesList from './components/CategoriesList';
import CreateCategory from './components/CreateCategory';
import UpdateCategory from './components/UpdateCategory';

type TabPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  index: number;
  value: number;
  children: React.ReactNode;
};

function TabPanel({ index, value, children, ...rest }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={index !== value}
      id={`categories-tabpanel-${index}`}
      aria-labelledby={`categories-tab-${index}`}
      {...rest}
    >
      {index === value && children}
    </div>
  );
}

type CategoriesSetter = React.Dispatch<React.SetStateAction<Category[]>>;

function Categories() {
  const [tabIndex, setTabIndex] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState<Category | null>(null);

  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);

  useEffect(() => {
    (async () => {
      setExpenseCategories(await getCategories({ type: 'expense' }));
      setIncomeCategories(await getCategories({ type: 'income' }));
    })();
  }, []);

  const handleCreateCategory = async (data: CreateCategoryData) => {
    const id = await createCategory(data);
    const category: Category = {
      ...data,
      id,
      total: 0,
    };

    const updateState = (setter: CategoriesSetter) => {
      setter((prev) => [...prev, category]);
    };

    if (data.type === 'expense') {
      updateState(setExpenseCategories);
    } else {
      updateState(setIncomeCategories);
    }
  };

  const handleUpdateCategory = async (data: UpdateCategoryData, original: Category) => {
    await updateCategory(original.id, data);
    const updatedCategory: Category = {
      ...original,
      ...data,
    };

    const updateState = (setter: CategoriesSetter) => {
      setter((prev) => prev.map((c) => (c.id !== updatedCategory.id ? c : updatedCategory)));
    };

    if (updatedCategory.type === 'expense') {
      updateState(setExpenseCategories);
    } else {
      updateState(setIncomeCategories);
    }
  };

  const handleDeleteCategory = async (original: Category) => {
    await deleteCategory(original.id);
    const updateState = (setter: CategoriesSetter) => {
      setter((prev) => prev.filter((c) => c.id !== original.id));
    };

    if (original.type === 'expense') {
      updateState(setExpenseCategories);
    } else {
      updateState(setIncomeCategories);
    }
  };

  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div">
            Categories
          </Typography>
        </Toolbar>
        <Tabs
          value={tabIndex}
          onChange={(_, value) => setTabIndex(value)}
          variant="fullWidth"
          textColor="inherit"
          slotProps={{
            indicator: {
              sx: {
                bgcolor: 'currentColor',
              },
            },
          }}
        >
          <Tab label="Expense" id="categories-tab-0" aria-controls="categories-tabpanel-0" />
          <Tab label="Income" id="categories-tab-1" aria-controls="categories-tabpanel-1" />
        </Tabs>
      </AppBar>
      <Box mt={13}>
        <TabPanel index={0} value={tabIndex}>
          <CategoriesList
            categories={expenseCategories}
            onClickCategory={(c) => setCategoryToUpdate(c)}
          />
        </TabPanel>
        <TabPanel index={1} value={tabIndex}>
          <CategoriesList
            categories={incomeCategories}
            onClickCategory={(c) => setCategoryToUpdate(c)}
          />
        </TabPanel>
      </Box>
      <CategoriesFAB onClick={() => setCreateDialogOpen(true)} />
      <CreateCategory
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateCategory}
      />
      <UpdateCategory
        category={categoryToUpdate}
        open={!!categoryToUpdate}
        onClose={() => setCategoryToUpdate(null)}
        onDelete={handleDeleteCategory}
        onSubmit={handleUpdateCategory}
      />
    </>
  );
}

export default Categories;

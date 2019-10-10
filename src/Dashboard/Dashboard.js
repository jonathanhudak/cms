import React from "react";
import { useAccount } from "@jmhudak/strapi-auth";
import { Box, Flex, Text, Heading, Button } from "rebass";
import { Label, Input, Textarea } from "@rebass/forms";
import {
  useHistory,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

function AccountInfo() {
  const { account, logout } = useAccount();
  const history = useHistory();

  const onLogout = () => {
    logout(() => history.push("/"));
  };

  return (
    <Flex py={2} alignItems='center' justifyContent='flex-end'>
      <Text mr={2}>Hello {account.user.username}!</Text>
      <Button onClick={onLogout} variant='outline'>
        Logout
      </Button>
    </Flex>
  );
}

const PAGES = gql`
  {
    pages {
      id
      title
      content
    }
  }
`;

const PAGE = gql`
  query GetPage($id: ID!) {
    page(id: $id) {
      id
      title
      content
    }
  }
`;

const ADD_PAGE = gql`
  mutation AddPage($title: String!, $content: JSON) {
    createPage(input: { data: { title: $title, content: $content } }) {
      page {
        id
        title
        content
      }
    }
  }
`;

const DELETE_PAGE = gql`
  mutation DeletePage($id: ID!) {
    deletePage(input: { where: { id: $id } }) {
      page {
        id
        title
      }
    }
  }
`;

function AddPage() {
  let input;
  const [addPage, { error }] = useMutation(ADD_PAGE, {
    update(
      cache,
      {
        data: {
          createPage: { page }
        }
      }
    ) {
      const { pages } = cache.readQuery({ query: PAGES });
      cache.writeQuery({
        query: PAGES,
        data: { pages: pages.concat([page]) }
      });
    }
  });

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          addPage({ variables: { title: input.value } });
          input.value = "";
        }}
      >
        {error && <Text color='tomato'>{error.message}</Text>}
        <Label htmlFor='page-title'>Page title</Label>
        <Input
          id='new-page-title'
          ref={node => {
            input = node;
          }}
        />

        <Button type='submit'>Add page</Button>
      </form>
    </div>
  );
}

function PageItem({ page }) {
  let { path } = useRouteMatch();
  const [deletePage, { error }] = useMutation(DELETE_PAGE, {
    update(
      cache,
      {
        data: {
          deletePage: { page: deletedPage }
        }
      }
    ) {
      const { pages } = cache.readQuery({ query: PAGES });
      cache.writeQuery({
        query: PAGES,
        data: { pages: pages.filter(p => p.id !== deletedPage.id) }
      });
    }
  });
  return (
    <Flex as='li' justifyContent='space-between' alignItems='center'>
      <Link to={`${path}/${page.id}`}>
        <Text>{page.title}</Text>
      </Link>
      <Box>
        <Button
          onClick={() => deletePage({ variables: { id: page.id } })}
          variant='secondary'
        >
          delete
        </Button>
        {error && <Text color='tomato'>{error.message}</Text>}
      </Box>
    </Flex>
  );
}

function Pages() {
  const { loading, error, data } = useQuery(PAGES);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const { pages } = data;
  return (
    <Box>
      <Heading>Pages</Heading>
      <Box as='ul'>
        {pages.map(page => (
          <PageItem key={page.id} page={page} />
        ))}
        <Box as='li'>
          <AddPage />
        </Box>
      </Box>
    </Box>
  );
}

const UPDATE_PAGE = gql`
  mutation UpdatePage($id: ID!, $title: String, $content: JSON) {
    updatePage(
      input: { where: { id: $id }, data: { title: $title, content: $content } }
    ) {
      page {
        title
        content
      }
    }
  }
`;

function EditPage() {
  let titleInput;
  let contentInput;
  const { id } = useParams();
  console.log("pageId", id);
  const { loading, error, data } = useQuery(PAGE, {
    variables: { id }
  });
  const [updatePage, { error: updatePageError }] = useMutation(UPDATE_PAGE, {
    update(
      cache,
      {
        data: { page: pageUpdate }
      }
    ) {
      cache.writeQuery({
        query: PAGE,
        data: { page: pageUpdate }
      });
    }
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( ${error.message}</p>;
  if (updatePageError) return <p>${updatePageError.message}</p>;
  const { page } = data;
  return (
    <Box
      as='form'
      onSubmit={e => {
        e.preventDefault();
        console.log(titleInput.value, contentInput.value);
        updatePage({
          variables: {
            id: page.id,
            title: titleInput.value,
            content: contentInput.value
          }
        });
      }}
    >
      <Box>
        <Label htmlFor='title'>Title</Label>
        <Input
          id='title'
          name='title'
          defaultValue={page.title}
          ref={el => {
            titleInput = el;
          }}
        />
      </Box>
      <Box>
        <Label htmlFor='content'>Content</Label>
        <Textarea
          id='content'
          name='content'
          defaultValue={page.content}
          ref={el => {
            contentInput = el;
          }}
        />
      </Box>
      <Button type='submit'>Update page</Button>
    </Box>
  );
}

export default function Dashboard() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <AccountInfo />
      <h1>Hello CMS!</h1>
      <nav>
        <Link to={`${url}/pages`}>Pages</Link>
      </nav>

      <Switch>
        <Route exact path={`${path}/pages`}>
          <Pages />
        </Route>
        <Route path={`${path}/pages/:id`}>
          <EditPage />
        </Route>
      </Switch>
    </div>
  );
}

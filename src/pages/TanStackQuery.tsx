import { useQuery } from "@tanstack/react-query";
import type { Todo } from "@/interfaces/types";
import { fetchTodos } from "@/api/api";

function TanStackQuery() {
  const { isPending, error, data } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  if (isPending) return "Đang Loading...";

  if (error) return "An error has occurred: " + error.message;

  return(
    <ul>
        {data.map((todo) => (
            <li key={todo.id}> {todo.userId} - {todo.id} - {todo.completed} - {todo.title}</li>
        ))}
    </ul>
  );
}

export default TanStackQuery;

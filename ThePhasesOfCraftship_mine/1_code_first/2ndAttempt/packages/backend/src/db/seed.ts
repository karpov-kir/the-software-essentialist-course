import { VoteType } from "@dddforum/shared/dist/dtos/VoteDto";

import { NotFoundError } from "../errors/NotFoundError";
import { encryptPassword } from "../utils/password";
import { CommentEntity } from "./entities/CommentEntity";
import { MemberEntity } from "./entities/MemberEntity";
import { PostEntity } from "./entities/PostEntity";
import { UserEntity } from "./entities/UserEntity";
import { VoteEntity } from "./entities/VoteEntity";
import { getOrm } from "./getOrm";

type CreationAttributes<T> = Omit<T, "id">;

// All users are created 30 days ago
const oneMonthMs = 30 * 24 * 60 * 60 * 1000;
const usersCreatedAt = new Date(Date.now() - oneMonthMs);

// Returns a random date in the range of 14 days from the `usersCreatedAt` date
const getRandomCreatedAt = () => {
  const twoWeeksMs = 14 * 24 * 60 * 60 * 1000;
  return new Date(usersCreatedAt.getTime() + Math.random() * twoWeeksMs);
};

export async function seed() {
  const { forkEm } = await getOrm();
  const em = forkEm();

  await em.nativeDelete(VoteEntity, {});
  await em.nativeDelete(CommentEntity, {});
  await em.nativeDelete(PostEntity, {});
  await em.nativeDelete(MemberEntity, {});
  await em.nativeDelete(UserEntity, {});

  const password123 = await encryptPassword("123");

  const usersPayload: CreationAttributes<UserEntity>[] = [
    {
      email: "bobvance@gmail.com",
      firstName: "Bob",
      lastName: "Vance",
      username: "bobvance",
      password: password123,
      createdAt: usersCreatedAt,
    },
    {
      email: "tonysoprano@gmail.com",
      firstName: "Tony",
      lastName: "Soprano",
      username: "tonysoprano",
      password: password123,
      createdAt: usersCreatedAt,
    },
    {
      email: "billburr@gmail.com",
      firstName: "Bill",
      lastName: "Burr",
      username: "billburr",
      password: password123,
      createdAt: usersCreatedAt,
    },
  ];
  const users = usersPayload.map((user) => em.create(UserEntity, user));

  await em.persistAndFlush(users);

  const members = users.map((user) => {
    const member: Omit<CreationAttributes<MemberEntity>, "votes" | "comments" | "posts"> = {
      user,
      createdAt: usersCreatedAt,
    };

    return em.create(MemberEntity, member);
  });

  await em.persistAndFlush(members);

  const [bobMember, tonyMember, billMember] = members;

  const postsPayload: Array<Omit<CreationAttributes<PostEntity>, "comments" | "votes" | "createdAt">> = [
    {
      title: "Struggling with Bounded Context Boundaries",
      content:
        "I'm currently working on a complex domain and having trouble defining clear bounded context boundaries. Any tips on how to identify them effectively? Are there any common pitfalls to avoid?",
      member: bobMember,
    },
    {
      title: "Ubiquitous Language - A Practical Guide",
      content:
        "I'm trying to implement Ubiquitous Language in my team, but we're facing challenges in aligning terminology across different teams. Any suggestions on how to foster a shared understanding and avoid confusion?",
      member: tonyMember,
    },
    {
      title: "Domain Events - Best Practices",
      content:
        "I'm interested in learning more about domain events and their role in DDD. How can I effectively identify domain events in my domain model? What are the best practices for handling them?",
      member: tonyMember,
    },
    {
      title: "Aggregates and Root Entities - A Deep Dive",
      content:
        "I'm struggling to understand the concept of aggregates and root entities. Can someone explain the difference between them and how to design them effectively?",
      member: bobMember,
    },
    {
      title: "DDD in Microservices Architecture",
      content:
        "How can DDD principles be applied to microservices architecture? What are the challenges and benefits of using DDD in this context?",
      member: billMember,
    },
    {
      title: "DDD and Legacy Systems",
      content:
        "I'm working on a legacy system and want to introduce DDD principles. What are the best strategies for migrating a legacy system to a DDD-based architecture?",
      member: bobMember,
    },
    {
      title: "DDD and Test-Driven Development (TDD)",
      content:
        "How can TDD be effectively integrated with DDD practices? What are the specific challenges and benefits of combining these two approaches?",
      member: tonyMember,
    },
    {
      title: "DDD and Event Sourcing",
      content:
        "I'm curious about the relationship between DDD and Event Sourcing. How can these two patterns be combined to create a robust and scalable system?",
      member: billMember,
    },
    {
      title: "DDD and CQRS",
      content:
        "What are the benefits of using CQRS with DDD? How can these two patterns be effectively integrated to improve system performance and scalability?",
      member: billMember,
    },
    {
      title: "DDD and Domain-Specific Languages (DSLs)",
      content:
        "Can DSLs be used to enhance the expressiveness of a DDD model? How can DSLs be designed and implemented to support DDD principles?",
      member: billMember,
    },
  ];

  const posts = postsPayload.map((post) =>
    em.create(PostEntity, {
      ...post,
      createdAt: getRandomCreatedAt(),
    }),
  );

  await em.persistAndFlush(posts);

  const [
    boundedContextsPost,
    ubiquitousLanguagePost,
    domainEventsPost,
    aggregatesPost,
    dddMicroservicesPost,
    dddLegacySystemsPost,
    dddTddPost,
    dddEventSourcingPost,
    dddCqrsPost,
    dddDslPost,
  ] = posts;
  const tonyPosts = posts.filter((post) => post.member.id === tonyMember.id);
  const billPosts = posts.filter((post) => post.member.id === billMember.id);

  const postVotesPayload: Omit<CreationAttributes<VoteEntity>, "createdAt">[] = [];

  // Everyone upvotes their own first post
  posts.forEach((post) => {
    postVotesPayload.push({ post: post, type: VoteType.Upvote, member: post.member });
  });

  postVotesPayload.push({
    post: tonyPosts[0],
    type: VoteType.Downvote,
    member: bobMember,
  });
  // Bill is a fan of Bob
  billPosts.forEach((post) => {
    postVotesPayload.push({ post, type: VoteType.Upvote, member: bobMember });
  });

  await em.persistAndFlush(
    postVotesPayload.map((votePayload) =>
      em.create(VoteEntity, {
        ...votePayload,
        createdAt: new Date(),
      }),
    ),
  );

  const postCommentsPayload: Array<Omit<CreationAttributes<CommentEntity>, "votes" | "createdAt">> = [];

  postCommentsPayload.push({
    post: boundedContextsPost,
    member: tonyMember,
    content:
      "Have you considered using Event Storming to visualize your domain and identify natural boundaries? It can be a great tool for clarifying complex domains.",
  });
  postCommentsPayload.push({
    post: boundedContextsPost,
    member: bobMember,
    content: "That's a great idea! I'll give it a try. Thanks for the tip.",
  });
  postCommentsPayload.push({
    post: boundedContextsPost,
    member: billMember,
    content: "Remember, bounded contexts should be loosely coupled. Overly tight coupling can hinder system evolution.",
  });
  postCommentsPayload.push({
    post: boundedContextsPost,
    member: billMember,
    content:
      "Have you considered using strategic design patterns like anticorruption layer or shared kernel to manage relationships between bounded contexts?",
  });

  postCommentsPayload.push({
    post: ubiquitousLanguagePost,
    member: billMember,
    content:
      "Don't forget to involve domain experts in language refinement. Their input is invaluable in ensuring accurate and concise terminology.",
  });
  postCommentsPayload.push({
    post: ubiquitousLanguagePost,
    member: tonyMember,
    content: "Absolutely. We've been working closely with our product owners to define a shared language.",
  });
  postCommentsPayload.push({
    post: ubiquitousLanguagePost,
    member: bobMember,
    content:
      "I've found that using language workshops can be a helpful way to align the team on terminology and concepts.",
  });

  postCommentsPayload.push({
    post: domainEventsPost,
    member: bobMember,
    content:
      "I'm curious about how you handle event sourcing with domain events. Any tips on implementing it effectively?",
  });
  postCommentsPayload.push({
    post: domainEventsPost,
    member: tonyMember,
    content:
      "Event sourcing can be a powerful tool, but it requires careful consideration of data consistency and performance. We've been using a CQRS pattern to address these concerns.",
  });
  postCommentsPayload.push({
    post: domainEventsPost,
    member: billMember,
    content:
      "Remember to keep your event schemas simple and flexible. Avoid over-engineering them to accommodate future requirements.",
  });
  postCommentsPayload.push({
    post: domainEventsPost,
    member: bobMember,
    content:
      "How do you handle event sourcing in a distributed system? What strategies do you use to ensure event ordering and consistency?",
  });
  postCommentsPayload.push({
    post: domainEventsPost,
    member: tonyMember,
    content:
      "We use a distributed event store with a strong consistency model to guarantee event order. We also implement sagas to coordinate complex business processes across multiple services.",
  });

  postCommentsPayload.push({
    post: aggregatesPost,
    member: billMember,
    content: "I've found that using a DDD framework can help enforce aggregate boundaries and consistency.",
  });
  postCommentsPayload.push({
    post: aggregatesPost,
    member: tonyMember,
    content: "That's a good point. A framework can provide valuable tools and patterns for implementing DDD.",
  });
  postCommentsPayload.push({
    post: aggregatesPost,
    member: bobMember,
    content: "I'm still struggling with the concept of aggregate root. Can you provide some concrete examples?",
  });

  postCommentsPayload.push({
    post: dddMicroservicesPost,
    member: tonyMember,
    content: "How do you handle data consistency across microservices when using DDD?",
  });
  postCommentsPayload.push({
    post: dddMicroservicesPost,
    member: billMember,
    content:
      "We use event sourcing and saga patterns to ensure eventual consistency. It's a trade-off between strong consistency and scalability.",
  });
  postCommentsPayload.push({
    post: dddMicroservicesPost,
    member: bobMember,
    content: "I'm interested in learning more about the challenges of implementing DDD in a microservices context.",
  });
  postCommentsPayload.push({
    post: dddMicroservicesPost,
    member: tonyMember,
    content: "What are your thoughts on using DDD to model shared business capabilities across microservices?",
  });
  postCommentsPayload.push({
    post: dddMicroservicesPost,
    member: bobMember,
    content:
      "Shared kernels can be used to define a common language and core domain concepts. However, it's important to minimize shared code to avoid tight coupling.",
  });

  postCommentsPayload.push({
    post: dddLegacySystemsPost,
    member: billMember,
    content: "Have you considered a gradual migration approach, starting with small, focused changes?",
  });
  postCommentsPayload.push({
    post: dddLegacySystemsPost,
    member: tonyMember,
    content:
      "That's a good strategy. We're planning to identify bounded contexts within the legacy system and refactor them incrementally.",
  });
  postCommentsPayload.push({
    post: dddLegacySystemsPost,
    member: bobMember,
    content:
      "I'm concerned about the potential risks of refactoring a legacy system. Any advice on mitigating those risks?",
  });

  postCommentsPayload.push({
    post: dddTddPost,
    member: tonyMember,
    content: "How do you test domain logic in isolation?",
  });
  postCommentsPayload.push({
    post: dddTddPost,
    member: billMember,
    content: "We use dependency injection and mocking to isolate domain objects and write unit tests.",
  });
  postCommentsPayload.push({
    post: dddTddPost,
    member: bobMember,
    content: "I'm curious about the role of integration tests in a DDD context.",
  });

  postCommentsPayload.push({
    post: dddEventSourcingPost,
    member: bobMember,
    content: "How do you handle event replay and data consistency in a large-scale event-sourced system?",
  });
  postCommentsPayload.push({
    post: dddEventSourcingPost,
    member: tonyMember,
    content:
      "Event replay is a powerful mechanism for recovering from failures and auditing system state. We use a combination of snapshotting and incremental replay to optimize performance.",
  });
  postCommentsPayload.push({
    post: dddEventSourcingPost,
    member: billMember,
    content:
      "Don't forget to consider the security implications of event sourcing. Protecting sensitive data in event streams is crucial.",
  });

  postCommentsPayload.push({
    post: dddCqrsPost,
    member: billMember,
    content: "How do you ensure data consistency between the command and query sides of a CQRS system?",
  });
  postCommentsPayload.push({
    post: dddCqrsPost,
    member: tonyMember,
    content:
      "We use event sourcing as the single source of truth and use event handlers to update both the command and query models.",
  });
  postCommentsPayload.push({
    post: dddCqrsPost,
    member: bobMember,
    content: "I'm interested in learning more about the performance implications of CQRS.",
  });

  postCommentsPayload.push({
    post: dddDslPost,
    member: tonyMember,
    content: "How do you balance the benefits of DSLs with the complexity of implementation and maintenance?",
  });
  postCommentsPayload.push({
    post: dddDslPost,
    member: billMember,
    content:
      "DSLs can be a powerful tool for domain experts to express complex business rules. However, they require careful design and testing.",
  });
  postCommentsPayload.push({
    post: dddDslPost,
    member: bobMember,
    content: "I'm curious about the use of internal DSLs versus external DSLs in DDD.",
  });

  // Bill is a fan of Bob
  billPosts.forEach((post) => {
    postCommentsPayload.push({ post, content: "BTW good question!", member: billMember });
  });

  const comments = postCommentsPayload.map((commentPayload, index) => {
    const postCreatedAt = posts.find((post) => post.id === commentPayload.post.id)?.createdAt.getTime();

    if (!postCreatedAt) {
      throw new NotFoundError({
        message: `Post with ID ${commentPayload.post.id} not found`,
      });
    }

    const twelveHours = 12 * 60 * 60 * 1000;
    const commentCreatedAt = new Date(postCreatedAt + index * twelveHours);

    return em.create(CommentEntity, {
      ...commentPayload,
      createdAt: commentCreatedAt,
    });
  });

  await em.persistAndFlush(comments);

  const bobComments = comments.filter((comment) => comment.member.id === bobMember.id);
  const commentVotesPayload: Omit<CreationAttributes<VoteEntity>, "createdAt">[] = [];

  // Bill is a fan of Bob
  bobComments.forEach((comment) => {
    const post = posts.find((post) => post.id === comment.post.id);
    commentVotesPayload.push({ comment, type: VoteType.Upvote, member: billMember, post });
  });

  await em.persistAndFlush(
    commentVotesPayload.map((votePayload) =>
      em.create(VoteEntity, {
        ...votePayload,
        createdAt: new Date(),
      }),
    ),
  );
}

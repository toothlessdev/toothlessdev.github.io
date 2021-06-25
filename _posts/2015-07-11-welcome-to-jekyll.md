---
layout: post
title:  "[Algorithm] 다익스트라 최단거리 알고리즘"
date:   2021-06-25
categories: Algorithm
---

<h2>📌다익스트라 최단거리 알고리즘</h2>
음의 간선이 없는 그래프에서, 어떤 시작 정점에서 다른 정점들 까지의 최단거리를 구하기 위해서 다익스트라 최단거리 알고리즘을 사용한다.
다익스트라 알고리즘은 `너비우선탐색(BFS)`와 유사한 방식으로 동작하는데, 최단거리를 구하기 위해서는 늦게 발견된 정점이더라도 가중치가 낮으면 먼저 방문 할 수 있어야 한다.

<h2>📌동작 원리</h2>
1. 우선순위 큐를 이용해 정점의 번호와 지금까지 찾아낸 해당 정점까지의 최단 거리를 쌍으로 넣는다.
2. 너비 우선 탐색과 유사하게, 정점을 방문 할 때 마다 인접한 정점을 모두 검사한다.
3. 현재 노드까지 최단거리에 가중치를 더해 인접 노드까지의 거리를 계산한다.
4. 지금까지 찾은 최단거리보다 짧으면 최단거리를 갱신하고 우선순위 큐에 넣는다.

<h2>📌코드</h2>
{% highlight c++ %}
vector<int> Dijkstra(int start_node){
  priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
  vector<int> dist(node_size, 1e9);
  
  dist[start_node] = 0;
  pq.push(make_pair(start_node, 0));
  
  while(!pq.empty()){
    int current_node = pq.top().first;
    int current_cost = pq.top().second;
    pq.pop();
    
    if(dist[current_node] < current_cost) continue;
    
    for(pair<int,int> adj : graph[current_node]){
      int adj_node = adj.first;
      int adj_cost = current_cost + adj.second;
      
      if(dist[adj_node] > adj_cost){
        dist[adj_node] = adj_cost;
        pq.push(make_pair(adj_node, adj_cost));
      }
    }
  return dist;
}
{% endhighlight %}
  
<h2>📌문제</h2>
[백준 1753 최단경로]
[백준 1753 최단경로]: https://www.acmicpc.net/problem/1753

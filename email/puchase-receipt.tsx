'use client';
import { Order } from '@/@types';
import { Html } from 'next/document';
import React from 'react';
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { formatCurrency } from '@/lib/utils';

export default function PuchaseReceipt({ order }: { order: Order }) {
  const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
  });
  return (
    <Html>
      <Preview>Detalhes do pedido realizado</Preview>
      <Tailwind>
        <Head />
        <Body className='font-sans bg-white'>
          <Container className='max-w-xl'>
            <Heading>Recibo da compra</Heading>
            <Section>
              <Row>
                <Column>
                  <Text className='mb-0 mr-4'>ID do Pedido</Text>
                  <Text className='mt-0 mr-4'>#{order.id.toString()}</Text>
                </Column>

                <Column>
                  <Text className='mb-0 mr-4'>Data da compra</Text>
                  <Text className='mt-0 mr-4'>
                    #{dateFormatter.format(order.createdAt)}
                  </Text>
                </Column>

                <Column>
                  <Text className='mb-0 mr-4'>Valor pago</Text>
                  <Text className='mt-0 mr-4'>
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className='border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4'>
              {order.OrderItem.map((item) => (
                <Row key={item.productId} className='mt-8'>
                  <Column className='w-20'>
                    <Img
                      width={'80'}
                      alt={item.name}
                      className='rounded'
                      src={
                        item.image.startsWith('/')
                          ? `${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`
                          : item.image
                      }
                    />
                  </Column>
                  <Column className='align-top'>
                    {item.name} x {item.quantity}
                  </Column>
                  <Column align='right' className='align-top'>
                    {formatCurrency(item.price)}
                  </Column>
                </Row>
              ))}
              {[
                { name: 'Itens', price: order.itemsPrice },
                { name: 'Tax', price: order.taxPrice },
                { name: 'Frete', price: order.shippingPrice },
                { name: 'Total', price: order.totalPrice },
              ].map((item) => (
                <Row key={item.name} className='mt-4'>
                  <Column align='right'>{item.name}</Column>
                  <Column align='right' width={70} className='align-top'>
                    <Text className='m-0'> {formatCurrency(item.price)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>{' '}
    </Html>
  );
}

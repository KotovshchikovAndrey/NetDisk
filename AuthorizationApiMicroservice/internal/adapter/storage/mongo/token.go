package mongo

import (
	"authorization/internal/core/domain"
	"authorization/internal/core/port"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type TokenDocument struct {
	ID        string    `bson:"_id"`
	CreatedAt time.Time `bson:"created_at"`
	ExpiredAt time.Time `bson:"expired_at"`
	UserID    string    `bson:"user_id"`
	DeviceID  string    `bson:"device_id"`
	IsRevoked bool      `bson:"is_revoked"`
}

func convertToTokenDocument(token *domain.Token) *TokenDocument {
	return &TokenDocument{
		ID:        token.ID,
		CreatedAt: token.CreatedAt,
		ExpiredAt: token.ExpiredAt,
		UserID:    token.UserID,
		DeviceID:  token.DeviceID,
		IsRevoked: token.IsRevoked,
	}
}

func convertToTokenDomain(token *TokenDocument) *domain.Token {
	return &domain.Token{
		ID:        token.ID,
		CreatedAt: token.CreatedAt,
		ExpiredAt: token.ExpiredAt,
		UserID:    token.UserID,
		DeviceID:  token.DeviceID,
		IsRevoked: token.IsRevoked,
	}
}

type TokenMongoRepository struct {
	client *mongo.Client
}

func NewTokenMongoRepository(client *mongo.Client) port.TokenRepository {
	return &TokenMongoRepository{client: client}
}

func (repository *TokenMongoRepository) GetByID(ctx context.Context, id string) (*domain.Token, error) {
	collection := repository.getTokenCollection()

	tokenDocument := &TokenDocument{}
	err := collection.FindOne(ctx, bson.M{"_id": id}).Decode(tokenDocument)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, domain.ErrNotFound
		}

		return nil, err
	}

	return convertToTokenDomain(tokenDocument), nil
}

func (repository *TokenMongoRepository) Save(ctx context.Context, token *domain.Token) error {
	collection := repository.getTokenCollection()
	tokenDocument := convertToTokenDocument(token)

	_, err := collection.UpdateOne(
		ctx,
		bson.M{"_id": tokenDocument.ID},
		bson.M{"$set": tokenDocument},
		options.Update().SetUpsert(true),
	)

	return err
}

func (repository *TokenMongoRepository) RevokeByUserDevice(ctx context.Context, userId string, deviceId string) error {
	collection := repository.getTokenCollection()
	_, err := collection.UpdateMany(
		ctx,
		bson.M{"user_id": userId, "device_id": deviceId},
		bson.M{"$set": bson.M{"is_revoked": true}},
	)

	return err
}

func (repository *TokenMongoRepository) RevokeByUser(ctx context.Context, userId string) error {
	collection := repository.getTokenCollection()
	_, err := collection.UpdateMany(
		ctx,
		bson.M{"user_id": userId},
		bson.M{"$set": bson.M{"is_revoked": true}},
	)

	return err
}

func (repository *TokenMongoRepository) RemoveExpired(ctx context.Context) error {
	collection := repository.getTokenCollection()
	_, err := collection.DeleteMany(ctx, bson.M{
		"expired_at": bson.M{
			"$lte": time.Now().UTC(),
		},
	})

	return err
}

func (repository *TokenMongoRepository) getTokenCollection() *mongo.Collection {
	return repository.client.Database("netdisk").Collection("tokens")
}
